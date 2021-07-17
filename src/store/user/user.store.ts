import { Module, Store } from 'vuex';

import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { UserProfileHttpService } from '../../core/services/http/user-profile-http/user-profile-http.service';

import { IState, state } from './user.state';
import { getters, IGetters } from './user.getters';
import { IMutations, mutations } from './user.mutations';
import { actions, IActions, setActionServices } from './user.actions';

export const userKey = 'user';

export const userGetters = <T extends keyof IGetters>(store: Store<any>, getter: T): ReturnType<IGetters[T]> => {
    return store.getters[`${userKey}/${getter}`];
}

export const userCommit = (store: Store<any>, mutation: keyof IMutations, payload: any): void => {
    store.commit(`${userKey}/${mutation}`, payload);
}

export const userDispatch = async<T extends keyof IActions>(store: Store<any>, action: T, payload?: any): Promise<ReturnType<IActions[T]>> => {
    return await store.dispatch(`${userKey}/${action}`, payload);
}

export const createStore = (): Module<IState, any> => {
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
