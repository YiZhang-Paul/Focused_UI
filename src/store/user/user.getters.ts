import { GetterTree } from 'vuex';

import { UserProfile } from '../../core/models/user/user-profile';

import { IUserState } from './user.state';

export enum UserGetter {
    Profile = 'profile'
}

export interface IUserGetters {
    [UserGetter.Profile](state: IUserState): UserProfile | null;
}

export const getters: GetterTree<IUserState, IUserState> & IUserGetters = {
    [UserGetter.Profile]: (state: IUserState): UserProfile | null => state.profile
};
