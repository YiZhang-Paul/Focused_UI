import { Module, Store } from 'vuex';

import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { PerformanceHttpService } from '../../core/services/http/performance-http/performance-http.service';
import { DataStoreUtility } from '../../core/utilities/data-store-utility/data-store-utility';

import { IState, state } from './performance.state';
import { GetterKey, getters, Getters } from './performance.getters';
import { Mutations, MutationKey, mutations } from './performance.mutations';
import { ActionKey, actions, Actions, setActionServices } from './performance.actions';

export const createModule = (): Module<IState, any> => ({
    namespaced: true,
    state,
    getters,
    mutations,
    actions
});

export const createHandlers = (namespace: string, getStore: () => Store<any>) => {
    setActionServices(container.get<PerformanceHttpService>(types.PerformanceHttpService));

    return DataStoreUtility.getHandlers<
        IState,
        Getters,
        Mutations,
        Actions,
        typeof GetterKey,
        typeof MutationKey,
        typeof ActionKey
    >(namespace, GetterKey, MutationKey, ActionKey, getStore);
}
