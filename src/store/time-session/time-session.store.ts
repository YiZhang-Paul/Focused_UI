import { Module, Store } from 'vuex';

import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { TimeSessionHttpService } from '../../core/services/http/time-session-http/time-session-http.service';

import { IState, state } from './time-session.state';
import { GetterKey, getters, IGetters } from './time-session.getters';
import { IMutations, MutationKey, mutations } from './time-session.mutations';
import { ActionKey, actions, IActions, setActionServices } from './time-session.actions';

type Unpacked<T> = T extends Promise<infer U> ? U : T;

export const createStore = (namespace: string) => {
    setActionServices(container.get<TimeSessionHttpService>(types.TimeSessionHttpService));

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
