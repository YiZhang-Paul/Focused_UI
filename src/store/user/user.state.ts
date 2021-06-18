import { ActionContext } from 'vuex';

import { UserProfile } from '../../core/models/user/user-profile';
import { UserProfileHttpService } from '../../core/services/http/user-profile-http/user-profile-http.service';

const userProfileHttpService = new UserProfileHttpService();

export interface IUserState {
    profile: UserProfile | null;
}

const state = (): IUserState => ({
    profile: null
});

const getters = {
    profile: (state: IUserState): UserProfile | null => state.profile
};

const mutations = {
    setProfile(state: IUserState, profile: UserProfile | null): void {
        state.profile = profile;
    }
};

const actions = {
    async loadProfile(context: ActionContext<IUserState, any>): Promise<void> {
        const user = await userProfileHttpService.getUserProfile('60cd1862629e063c384f3ea1');
        context.commit('setProfile', user);
    }
};

export const userKey = 'user';

export const user = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
