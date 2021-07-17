import { Module, Store } from 'vuex';

import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { UserProfileHttpService } from '../../core/services/http/user-profile-http/user-profile-http.service';

import { IUserState, state } from './user.state';
import { getters, IUserGetters } from './user.getters';
import { mutations, UserMutation } from './user.mutations';
import { actions, IUserActions, setActionServices } from './user.actions';

export const userKey = 'user';

export const userGetters = <T extends keyof IUserGetters>(rootStore: Store<any>, getter: T): ReturnType<IUserGetters[T]> => {
    return rootStore.getters[`${userKey}/${getter}`];
}

export const userCommit = (rootStore: Store<any>, mutation: UserMutation, payload: any): void => {
    rootStore.commit(`${userKey}/${mutation}`, payload);
}

export const userDispatch = async<T extends keyof IUserActions>(rootStore: Store<any>, action: T, payload?: any): Promise<ReturnType<IUserActions[T]>> => {
    return await rootStore.dispatch(`${userKey}/${action}`, payload);
}

export const createStore = (): Module<IUserState, any> => {
    const userProfileHttp = container.get<UserProfileHttpService>(types.UserProfileHttpService);
    setActionServices(userProfileHttp);

    return {
        namespaced: true,
        state,
        getters,
        mutations,
        actions
    };
}

export const user = createStore();
