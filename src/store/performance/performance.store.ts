import { Module, Store } from 'vuex';

import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { PerformanceHttpService } from '../../core/services/http/performance-http/performance-http.service';

import { IState, state } from './performance.state';
import { getters, IGetters } from './performance.getters';
import { IMutations, mutations } from './performance.mutations';
import { actions, IActions, setActionServices } from './performance.actions';

export const performanceKey = 'performance';

export const performanceGetters = <T extends keyof IGetters>(store: Store<any>, getter: T): ReturnType<IGetters[T]> => {
    return store.getters[`${performanceKey}/${getter}`];
}

export const performanceCommit = (store: Store<any>, mutation: keyof IMutations, payload: any): void => {
    store.commit(`${performanceKey}/${mutation}`, payload);
}

export const performanceDispatch = async<T extends keyof IActions>(store: Store<any>, action: T, payload?: any): Promise<ReturnType<IActions[T]>> => {
    return await store.dispatch(`${performanceKey}/${action}`, payload);
}

export const createStore = (): Module<IState, any> => {
    const performanceHttp = container.get<PerformanceHttpService>(types.PerformanceHttpService);
    setActionServices(performanceHttp);

    return {
        namespaced: true,
        state,
        getters,
        mutations,
        actions
    };
}

export const performance = createStore();
