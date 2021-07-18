import { Module, Store } from 'vuex';

import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { UserProfileHttpService } from '../../core/services/http/user-profile-http/user-profile-http.service';
import { DataStoreUtility } from '../../core/utilities/data-store-utility/data-store-utility';

import { IState, state } from './user.state';
import { GetterKey, getters, Getters } from './user.getters';
import { Mutations, MutationKey, mutations } from './user.mutations';
import { ActionKey, actions, Actions, setActionServices } from './user.actions';

export const createModule = (): Module<IState, any> => ({
    namespaced: true,
    state,
    getters,
    mutations,
    actions
});

export const createHandlers = (namespace: string, getStore: () => Store<any>) => {
    setActionServices(container.get<UserProfileHttpService>(types.UserProfileHttpService));

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
