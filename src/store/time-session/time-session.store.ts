import { Module, Store } from 'vuex';

import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { TimeSessionHttpService } from '../../core/services/http/time-session-http/time-session-http.service';

import { ITimeSessionState, state } from './time-session.state';
import { getters, TimeSessionGetter } from './time-session.getters';
import { mutations, TimeSessionMutation } from './time-session.mutations';
import { actions, setActionServices, TimeSessionAction } from './time-session.actions';

export const timeSessionKey = 'timeSession';

export const timeSessionGetters = <T = any>(rootStore: Store<any>, getter: TimeSessionGetter): T => {
    return rootStore.getters[`${timeSessionKey}/${getter}`];
}

export const timeSessionCommit = <T = any>(rootStore: Store<any>, mutation: TimeSessionMutation, payload: T): void => {
    rootStore.commit(`${timeSessionKey}/${mutation}`, payload);
}

export const timeSessionDispatch = async<T = void>(rootStore: Store<any>, action: TimeSessionAction, payload?: any): Promise<T> => {
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
