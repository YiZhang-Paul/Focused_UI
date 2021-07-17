import { Module, Store } from 'vuex';

import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { WorkItemHttpService } from '../../core/services/http/work-item-http/work-item-http.service';

import { IWorkItemState, state } from './work-item.state';
import { getters, WorkItemGetter } from './work-item.getters';
import { mutations, WorkItemMutation } from './work-item.mutations';
import { actions, setActionServices, WorkItemAction } from './work-item.actions';

export const workItemKey = 'workItem';
export const workItemState = (rootStore: Store<any>): IWorkItemState => rootStore.state[workItemKey];

export const workItemGetters = <T = any>(rootStore: Store<any>, getter: WorkItemGetter): T => {
    return rootStore.getters[`${workItemKey}/${getter}`];
}

export const workItemCommit = <T = any>(rootStore: Store<any>, mutation: WorkItemMutation, payload: T): void => {
    rootStore.commit(`${workItemKey}/${mutation}`, payload);
}

export const workItemDispatch = async<T = void>(rootStore: Store<any>, action: WorkItemAction, payload?: any): Promise<T> => {
    return await rootStore.dispatch(`${workItemKey}/${action}`, payload);
}

export const createStore = (): Module<IWorkItemState, any> => {
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
