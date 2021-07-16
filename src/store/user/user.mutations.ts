import { MutationTree } from 'vuex';

import { UserProfile } from '../../core/models/user/user-profile';

import { IUserState } from './user.state';

export enum UserMutation {
    SetProfile = 'set_profile'
}

export interface IUserMutations {
    [UserMutation.SetProfile](state: IUserState, profile: UserProfile | null): void;
}

export const mutations: MutationTree<IUserState> & IUserMutations = {
    [UserMutation.SetProfile](state: IUserState, profile: UserProfile | null): void {
        state.profile = profile;
    }
};
