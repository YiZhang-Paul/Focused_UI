import { Module, Store } from 'vuex';

import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { UserProfileHttpService } from '../../core/services/http/user-profile-http/user-profile-http.service';

import { IUserState, state } from './user.state';
import { getters, UserGetter } from './user.getters';
import { mutations, UserMutation } from './user.mutations';
import { actions, setActionServices, UserAction } from './user.actions';

export const userKey = 'user';

export const userGetters = <T = any>(rootStore: Store<any>, getter: UserGetter): T => {
    return rootStore.getters[`${userKey}/${getter}`];
}

export const userCommit = <T = any>(rootStore: Store<any>, mutation: UserMutation, payload: T): void => {
    rootStore.commit(`${userKey}/${mutation}`, payload);
}

export const userDispatch = async<T = void>(rootStore: Store<any>, action: UserAction, payload?: any): Promise<T> => {
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
