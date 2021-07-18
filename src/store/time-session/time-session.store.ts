import { Module } from 'vuex';

import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { TimeSessionHttpService } from '../../core/services/http/time-session-http/time-session-http.service';
import { DataStoreUtility } from '../../core/utilities/data-store-utility/data-store-utility';

import { IState, state } from './time-session.state';
import { GetterKey, getters, Getters } from './time-session.getters';
import { Mutations, MutationKey, mutations } from './time-session.mutations';
import { ActionKey, actions, Actions, setActionServices } from './time-session.actions';

export const createStore = (namespace: string) => {
    setActionServices(container.get<TimeSessionHttpService>(types.TimeSessionHttpService));

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
