import { ActionContext } from 'vuex';

import { WorkItemDto } from '../../core/dtos/work-item-dto';
import { ActivityBreakdownDto } from '../../core/dtos/activity-breakdown-dto';
import { FocusSession } from '../../core/models/time-session/focus-session';
import { BreakSession } from '../../core/models/time-session/break-session';
import { WorkItemType } from '../../core/enums/work-item-type.enum';
import { WorkItemStatus } from '../../core/enums/work-item-status.enum';
import { TimeSessionStatus } from '../../core/enums/time-session-status.enum';
import { UserProfileHttpService } from '../../core/services/http/user-profile-http/user-profile-http.service';
import { TimeSessionHttpService } from '../../core/services/http/time-session-http/time-session-http.service';

const oneSecond = 1000;
const oneHour = oneSecond * 60 * 60;
const userProfileHttpService = new UserProfileHttpService();
const timeSessionHttpService = new TimeSessionHttpService();

export interface ITimeSessionState {
    activeWorkItems: WorkItemDto[];
    activeFocusSession: FocusSession | null;
    activeFocusSessionActivities: ActivityBreakdownDto | null;
    activeBreakSession: BreakSession | null;
}

const state = (): ITimeSessionState => ({
    activeWorkItems: [],
    activeFocusSession: null,
    activeFocusSessionActivities: null,
    activeBreakSession: null
});

const getters = {
    timeSessionStatus: (state: ITimeSessionState): TimeSessionStatus => {
        if (state.activeBreakSession) {
            return TimeSessionStatus.Resting;
        }

        if (!state.activeFocusSession) {
            return TimeSessionStatus.Idle;
        }

        const isOngoing = state.activeWorkItems.some(_ => _.status === WorkItemStatus.Ongoing);

        return isOngoing ? TimeSessionStatus.Ongoing : TimeSessionStatus.Pending;
    },
    activeWorkItems: (state: ITimeSessionState): WorkItemDto[] => state.activeWorkItems,
    activeFocusSession: (state: ITimeSessionState): FocusSession | null => state.activeFocusSession,
    activeFocusSessionActivities: (state: ITimeSessionState): ActivityBreakdownDto | null => state.activeFocusSessionActivities,
    activeBreakSession: (state: ITimeSessionState): BreakSession | null => state.activeBreakSession
};

const mutations = {
    setActiveWorkItems(state: ITimeSessionState, items: WorkItemDto[]): void {
        state.activeWorkItems = items;
    },
    setActiveFocusSession(state: ITimeSessionState, session: FocusSession | null): void {
        state.activeFocusSession = session;
    },
    setActiveFocusSessionActivities(state: ITimeSessionState, activities: ActivityBreakdownDto | null): void {
        state.activeFocusSessionActivities = activities;
    },
    setActiveBreakSession(state: ITimeSessionState, session: BreakSession | null): void {
        state.activeBreakSession = session;
    }
};

const actions = {
    async loadActiveTimeSession(context: ActionContext<ITimeSessionState, any>): Promise<void> {
        const user = await userProfileHttpService.getUserProfile('60cd1862629e063c384f3ea1');

        if (user?.breakSessionId) {
            const session = await timeSessionHttpService.getBreakSession(user.breakSessionId);
            context.commit('setActiveBreakSession', session);
        }
        else if (user?.focusSessionId) {
            const session = await timeSessionHttpService.getFocusSession(user.focusSessionId);
            const activities = await timeSessionHttpService.getFocusSessionActivities(user.focusSessionId);
            context.commit('setActiveFocusSession', session);
            context.commit('setActiveFocusSessionActivities', activities);
        }
    },
    syncActiveTimeSession(context: ActionContext<ITimeSessionState, any>): void {
        const { getters, commit } = context;
        const breakSession = getters['activeBreakSession'] as BreakSession;
        const activities = getters['activeFocusSessionActivities'] as ActivityBreakdownDto;

        if (breakSession) {
            commit('setActiveBreakSession', { ...breakSession });
        }
        else if (activities) {
            const delta = oneSecond / oneHour;
            const items: WorkItemDto[] = getters['activeWorkItems'];
            const ongoing = items.find(_ => _.status === WorkItemStatus.Ongoing);
            activities.regular += ongoing?.type === WorkItemType.Regular ? delta : 0;
            activities.recurring += ongoing?.type === WorkItemType.Recurring ? delta : 0;
            activities.interruption += ongoing?.type === WorkItemType.Interruption ? delta : 0;
            activities.overlearning += ongoing ? 0 : delta;
            commit('setActiveFocusSessionActivities', { ...activities });
        }

        setTimeout(() => actions.syncActiveTimeSession(context), oneSecond);
    }
};

export const timeSessionKey = 'timeSession';

export const timeSession = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
