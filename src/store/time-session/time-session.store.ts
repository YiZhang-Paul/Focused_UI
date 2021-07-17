import { Module, Store } from 'vuex';

import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { TimeSessionHttpService } from '../../core/services/http/time-session-http/time-session-http.service';

import { IState, state } from './time-session.state';
import { getters, IGetters } from './time-session.getters';
import { IMutations, mutations } from './time-session.mutations';
import { actions, IActions, setActionServices } from './time-session.actions';

export const timeSessionKey = 'timeSession';

export const timeSessionGetters = <T extends keyof IGetters>(store: Store<any>, getter: T): ReturnType<IGetters[T]> => {
    return store.getters[`${timeSessionKey}/${getter}`];
}

export const timeSessionCommit = (store: Store<any>, mutation: keyof IMutations, payload: any): void => {
    store.commit(`${timeSessionKey}/${mutation}`, payload);
}

export const timeSessionDispatch = async<T extends keyof IActions>(store: Store<any>, action: T, payload?: any): Promise<ReturnType<IActions[T]>> => {
    return await store.dispatch(`${timeSessionKey}/${action}`, payload);
}

export const createStore = (): Module<IState, any> => {
    const timeSessionHttp = container.get<TimeSessionHttpService>(types.TimeSessionHttpService);
    setActionServices(timeSessionHttp);

    return {
        namespaced: true,
        state,
        getters,
        mutations,
        actions
    };
};

export const timeSession = createStore();
