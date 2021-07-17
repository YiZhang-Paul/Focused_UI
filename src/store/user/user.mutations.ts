import { MutationTree } from 'vuex';

import { UserProfile } from '../../core/models/user/user-profile';

import { IState } from './user.state';

export enum MutationKey {
    SetProfile = 'set_profile'
}

export interface IMutations {
    [MutationKey.SetProfile](state: IState, profile: UserProfile | null): void;
}

export const mutations: MutationTree<IState> & IMutations = {
    [MutationKey.SetProfile](state: IState, profile: UserProfile | null): void {
        state.profile = profile;
    }
};
