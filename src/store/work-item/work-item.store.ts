import { Module, Store } from 'vuex';

import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { WorkItemHttpService } from '../../core/services/http/work-item-http/work-item-http.service';

import { IState, state } from './work-item.state';
import { GetterKey, getters, IGetters } from './work-item.getters';
import { IMutations, MutationKey, mutations } from './work-item.mutations';
import { ActionKey, actions, IActions, setActionServices } from './work-item.actions';

type Unpacked<T> = T extends Promise<infer U> ? U : T;

export const createStore = (namespace: string) => {
    setActionServices(container.get<WorkItemHttpService>(types.WorkItemHttpService));

    const module: Module<IState, any> = {
        namespaced: true,
        state,
        getters,
        mutations,
        actions
    };

    const utilities = {
        keys: {
            getters: GetterKey,
            mutations: MutationKey,
            actions: ActionKey
        },
        state: (store: Store<any>): IState => store.state[namespace],
        getters<T extends keyof IGetters>(store: Store<any>, getter: T): ReturnType<IGetters[T]> {
            return store.getters[`${namespace}/${getter}`];
        },
        commit(store: Store<any>, mutation: keyof IMutations, payload: any): void {
            store.commit(`${namespace}/${mutation}`, payload);
        },
        async dispatch<T extends keyof IActions>(store: Store<any>, action: T, payload?: any): Promise<Unpacked<ReturnType<IActions[T]>>> {
            return await store.dispatch(`${namespace}/${action}`, payload);
        }
    };

    return { module, utilities };
}
