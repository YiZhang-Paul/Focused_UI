import { ActionContext } from 'vuex';

import { FocusSessionDto } from '../../core/dtos/focus-session-dto';
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
    activeFocusSession: FocusSessionDto | null;
    activeBreakSession: BreakSession | null;
}

const state = (): ITimeSessionState => ({
    activeFocusSession: null,
    activeBreakSession: null
});

const getters = {
    timeSessionStatus: (state: ITimeSessionState): TimeSessionStatus => {
        const { activeFocusSession, activeBreakSession } = state;

        if (activeBreakSession) {
            return TimeSessionStatus.Resting;
        }

        if (!activeFocusSession) {
            return TimeSessionStatus.Idle;
        }

        const isOngoing = activeFocusSession.workItems.some(_ => _.status === WorkItemStatus.Ongoing);

        return isOngoing ? TimeSessionStatus.Ongoing : TimeSessionStatus.Pending;
    },
    activeFocusSession: (state: ITimeSessionState): FocusSessionDto | null => state.activeFocusSession,
    activeBreakSession: (state: ITimeSessionState): BreakSession | null => state.activeBreakSession
};

const mutations = {
    setActiveFocusSession(state: ITimeSessionState, session: FocusSessionDto | null): void {
        state.activeFocusSession = session;
    },
    setActiveBreakSession(state: ITimeSessionState, session: BreakSession | null): void {
        state.activeBreakSession = session;
    }
};

const actions = {
    async loadActiveTimeSession(context: ActionContext<ITimeSessionState, any>): Promise<void> {
        const user = await userProfileHttpService.getUserProfile('60cd1862629e063c384f3ea1');

        if (user?.focusSessionId) {
            const session = await timeSessionHttpService.getFocusSessionMeta(user.focusSessionId);
            context.commit('setActiveFocusSession', session);
        }
        else if (user?.breakSessionId) {
            const session = await timeSessionHttpService.getBreakSession(user.breakSessionId);
            context.commit('setActiveBreakSession', session);
        }
    },
    syncActiveTimeSession(context: ActionContext<ITimeSessionState, any>): void {
        const { getters, commit } = context;
        const focusSession = getters['activeFocusSession'] as FocusSessionDto;
        const breakSession = getters['activeBreakSession'] as BreakSession;

        if (focusSession) {
            const delta = oneSecond / oneHour;
            const { workItems, activities } = focusSession;
            const ongoing = workItems.find(_ => _.status === WorkItemStatus.Ongoing);
            activities.regular += ongoing?.type === WorkItemType.Regular ? delta : 0;
            activities.recurring += ongoing?.type === WorkItemType.Recurring ? delta : 0;
            activities.interruption += ongoing?.type === WorkItemType.Interruption ? delta : 0;
            activities.overlearning += ongoing ? 0 : delta;
            commit('setActiveFocusSession', { ...focusSession });
        }
        else if (breakSession) {
            commit('setActiveBreakSession', { ...breakSession });
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
