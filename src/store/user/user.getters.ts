import { GetterTree } from 'vuex';

import { UserProfile } from '../../core/models/user/user-profile';

import { IState } from './user.state';

export enum GetterKey {
    Profile = 'profile'
}

export type Getters = {
    [GetterKey.Profile](state: IState): UserProfile | null;
}

export const getters: GetterTree<IState, IState> & Getters = {
    [GetterKey.Profile]: (state: IState): UserProfile | null => state.profile
};
