import { ActionContext } from 'vuex';

import { WorkItemDto } from '../../core/dtos/work-item-dto';
import { FocusSession } from '../../core/models/time-session/focus-session';
import { BreakSession } from '../../core/models/time-session/break-session';
import { WorkItemStatus } from '../../core/enums/work-item-status.enum';
import { TimeSessionStatus } from '../../core/enums/time-session-status.enum';
import { UserProfileHttpService } from '../../core/services/http/user-profile-http/user-profile-http.service';
import { TimeSessionHttpService } from '../../core/services/http/time-session-http/time-session-http.service';

const userProfileHttpService = new UserProfileHttpService();
const timeSessionHttpService = new TimeSessionHttpService();

export interface ITimeSessionState {
    activeWorkItems: WorkItemDto[];
    activeFocusSession: FocusSession | null;
    activeBreakSession: BreakSession | null;
}

const state = (): ITimeSessionState => ({
    activeWorkItems: [],
    activeFocusSession: null,
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
    activeBreakSession: (state: ITimeSessionState): BreakSession | null => state.activeBreakSession
};

const mutations = {
    setActiveWorkItems(state: ITimeSessionState, items: WorkItemDto[]): void {
        state.activeWorkItems = items;
    },
    setActiveFocusSession(state: ITimeSessionState, session: FocusSession | null): void {
        state.activeFocusSession = session;
    },
    setActiveBreakSession(state: ITimeSessionState, session: BreakSession | null): void {
        state.activeBreakSession = session;
    }
};

const actions = {
    async loadActiveFocusSession(context: ActionContext<ITimeSessionState, any>): Promise<void> {
        const user = await userProfileHttpService.getUserProfile('60cd1862629e063c384f3ea1');

        if (user?.focusSessionId) {
            const session = await timeSessionHttpService.getFocusSession(user.focusSessionId);
            context.commit('setActiveFocusSession', session);
        }
    },
    async loadActiveBreakSession(context: ActionContext<ITimeSessionState, any>): Promise<void> {
        const user = await userProfileHttpService.getUserProfile('60cd1862629e063c384f3ea1');

        if (user?.breakSessionId) {
            const session = await timeSessionHttpService.getBreakSession(user.breakSessionId);
            context.commit('setActiveBreakSession', session);
        }
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
