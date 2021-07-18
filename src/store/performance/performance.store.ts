import { Module } from 'vuex';

import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { PerformanceHttpService } from '../../core/services/http/performance-http/performance-http.service';
import { DataStoreUtility } from '../../core/utilities/data-store-utility/data-store-utility';

import { IState, state } from './performance.state';
import { GetterKey, getters, Getters } from './performance.getters';
import { Mutations, MutationKey, mutations } from './performance.mutations';
import { ActionKey, actions, Actions, setActionServices } from './performance.actions';

export const createStore = (namespace: string) => {
    setActionServices(container.get<PerformanceHttpService>(types.PerformanceHttpService));

    const handlers = DataStoreUtility.getHandlers<
        IState,
        Getters,
        Mutations,
        Actions,
        typeof GetterKey,
        typeof MutationKey,
        typeof ActionKey
    >(namespace, GetterKey, MutationKey, ActionKey);

    const module: Module<IState, any> = {
        namespaced: true,
        state,
        getters,
        mutations,
        actions
    };

    return { handlers, module };
}
