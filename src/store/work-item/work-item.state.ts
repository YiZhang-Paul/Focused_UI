import { ActionContext } from 'vuex';

import { WorkItemDto } from '../../core/dtos/work-item-dto';
import { WorkItemQuery } from '../../core/models/work-item/work-item-query';
import { WorkItemHttpService } from '../../core/services/http/work-item-http/work-item-http.service';

const workItemHttpService = new WorkItemHttpService();

export interface IWorkItemState {
    pendingWorkItem: WorkItemDto | null;
    workItems: WorkItemDto[];
}

const state = (): IWorkItemState => ({
    pendingWorkItem: null,
    workItems: []
});

const getters = {
    pendingWorkItem: (state: IWorkItemState): WorkItemDto | null => state.pendingWorkItem,
    workItems: (state: IWorkItemState): WorkItemDto[] => state.workItems
};

const mutations = {
    setPendingWorkItem(state: IWorkItemState, item: WorkItemDto | null): void {
        state.pendingWorkItem = item;
    },
    setWorkItems(state: IWorkItemState, items: WorkItemDto[]): void {
        state.workItems = items.slice();
    }
};

const actions = {
    async createWorkItem(context: ActionContext<IWorkItemState, any>): Promise<void> {
        const { state, commit, dispatch } = context;

        if (state.pendingWorkItem && await workItemHttpService.createWorkItem(state.pendingWorkItem)) {
            commit('setPendingWorkItem', null);
            await dispatch('loadWorkItems');
        }
    },
    async loadWorkItems(context: ActionContext<IWorkItemState, any>, payload: WorkItemQuery | null): Promise<void> {
        const query = payload ?? new WorkItemQuery();
        context.commit('setWorkItems', await workItemHttpService.getWorkItems(query));
    }
};

export const workItemKey = 'workItem';

export const workItem = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
