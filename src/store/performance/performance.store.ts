import { Module, Store } from 'vuex';

import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { PerformanceHttpService } from '../../core/services/http/performance-http/performance-http.service';

import { IPerformanceState, state } from './performance.state';
import { getters, PerformanceGetter } from './performance.getters';
import { mutations, PerformanceMutation } from './performance.mutations';
import { actions, setActionServices, PerformanceAction } from './performance.actions';

export const performanceKey = 'performance';

export const performanceGetters = <T = any>(rootStore: Store<any>, getter: PerformanceGetter): T => {
    return rootStore.getters[`${performanceKey}/${getter}`];
}

export const performanceCommit = <T = any>(rootStore: Store<any>, mutation: PerformanceMutation, payload: T): void => {
    rootStore.commit(`${performanceKey}/${mutation}`, payload);
}

export const performanceDispatch = async<T = void>(rootStore: Store<any>, action: PerformanceAction, payload?: any): Promise<T> => {
    return await rootStore.dispatch(`${performanceKey}/${action}`, payload);
}

export const createStore = (): Module<IPerformanceState, any> => {
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
