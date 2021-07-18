import { Module } from 'vuex';

import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { WorkItemHttpService } from '../../core/services/http/work-item-http/work-item-http.service';
import { DataStoreUtility } from '../../core/utilities/data-store-utility/data-store-utility';

import { IState, state } from './work-item.state';
import { GetterKey, getters, Getters } from './work-item.getters';
import { Mutations, MutationKey, mutations } from './work-item.mutations';
import { ActionKey, actions, Actions, setActionServices } from './work-item.actions';

export const createStore = (namespace: string) => {
    setActionServices(container.get<WorkItemHttpService>(types.WorkItemHttpService));

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
