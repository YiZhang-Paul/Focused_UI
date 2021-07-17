import { Module, Store } from 'vuex';

import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { WorkItemHttpService } from '../../core/services/http/work-item-http/work-item-http.service';

import { IState, state } from './work-item.state';
import { getters, IGetters } from './work-item.getters';
import { IMutations, mutations } from './work-item.mutations';
import { actions, IActions, setActionServices } from './work-item.actions';

export const workItemKey = 'workItem';
export const workItemState = (store: Store<any>): IState => store.state[workItemKey];

export const workItemGetters = <T extends keyof IGetters>(store: Store<any>, getter: T): ReturnType<IGetters[T]> => {
    return store.getters[`${workItemKey}/${getter}`];
}

export const workItemCommit = (store: Store<any>, mutation: keyof IMutations, payload: any): void => {
    store.commit(`${workItemKey}/${mutation}`, payload);
}

export const workItemDispatch = async<T extends keyof IActions>(store: Store<any>, action: T, payload?: any): Promise<ReturnType<IActions[T]>> => {
    return await store.dispatch(`${workItemKey}/${action}`, payload);
}

export const createStore = (): Module<IState, any> => {
    const workItemHttp = container.get<WorkItemHttpService>(types.WorkItemHttpService);
    setActionServices(workItemHttp);

    return {
        namespaced: true,
        state,
        getters,
        mutations,
        actions
    };
};

export const workItem = createStore();
