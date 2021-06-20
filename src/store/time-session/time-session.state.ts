import { ActionContext } from 'vuex';

import { FocusSession } from '../../core/models/time-session/focus-session';
import { UserProfileHttpService } from '../../core/services/http/user-profile-http/user-profile-http.service';
import { TimeSessionHttpService } from '../../core/services/http/time-session-http/time-session-http.service';

const userProfileHttpService = new UserProfileHttpService();
const timeSessionHttpService = new TimeSessionHttpService();

export interface ITimeSessionState {
    activeFocusSession: FocusSession | null;
}

const state = (): ITimeSessionState => ({
    activeFocusSession: null
});

const getters = {
    activeFocusSession: (state: ITimeSessionState): FocusSession | null => state.activeFocusSession
};

const mutations = {
    setActiveFocusSession(state: ITimeSessionState, session: FocusSession | null): void {
        state.activeFocusSession = session;
    }
};

const actions = {
    async loadActiveFocusSession(context: ActionContext<ITimeSessionState, any>): Promise<void> {
        const user = await userProfileHttpService.getUserProfile('60cd1862629e063c384f3ea1');

        if (user?.focusSessionId) {
            const session = await timeSessionHttpService.getFocusSession(user.focusSessionId);
            context.commit('setActiveFocusSession', session);
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
