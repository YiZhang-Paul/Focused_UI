import { Module, Store } from 'vuex';

import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { PerformanceHttpService } from '../../core/services/http/performance-http/performance-http.service';

import { IPerformanceState, state } from './performance.state';
import { getters, IPerformanceGetters } from './performance.getters';
import { mutations, PerformanceMutation } from './performance.mutations';
import { actions, setActionServices, IPerformanceActions } from './performance.actions';

export const performanceKey = 'performance';

export const performanceGetters = <T extends keyof IPerformanceGetters>(rootStore: Store<any>, getter: T): ReturnType<IPerformanceGetters[T]> => {
    return rootStore.getters[`${performanceKey}/${getter}`];
}

export const performanceCommit = (rootStore: Store<any>, mutation: PerformanceMutation, payload: any): void => {
    rootStore.commit(`${performanceKey}/${mutation}`, payload);
}

export const performanceDispatch = async<T extends keyof IPerformanceActions>(rootStore: Store<any>, action: T, payload?: any): Promise<ReturnType<IPerformanceActions[T]>> => {
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
