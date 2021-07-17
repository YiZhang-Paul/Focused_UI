import { Module, Store } from 'vuex';

import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { TimeSessionHttpService } from '../../core/services/http/time-session-http/time-session-http.service';

import { ITimeSessionState, state } from './time-session.state';
import { getters, ITimeSessionGetters } from './time-session.getters';
import { mutations, TimeSessionMutation } from './time-session.mutations';
import { actions, ITimeSessionActions, setActionServices } from './time-session.actions';

export const timeSessionKey = 'timeSession';

export const timeSessionGetters = <T extends keyof ITimeSessionGetters>(rootStore: Store<any>, getter: T): ReturnType<ITimeSessionGetters[T]> => {
    return rootStore.getters[`${timeSessionKey}/${getter}`];
}

export const timeSessionCommit = (rootStore: Store<any>, mutation: TimeSessionMutation, payload: any): void => {
    rootStore.commit(`${timeSessionKey}/${mutation}`, payload);
}

export const timeSessionDispatch = async<T extends keyof ITimeSessionActions>(rootStore: Store<any>, action: T, payload?: any): Promise<ReturnType<ITimeSessionActions[T]>> => {
    return await rootStore.dispatch(`${timeSessionKey}/${action}`, payload);
}

export const createStore = (): Module<ITimeSessionState, any> => {
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
