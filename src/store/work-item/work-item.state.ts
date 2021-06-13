import { ActionContext } from 'vuex';

import { WorkItemDto } from '../../core/dtos/work-item-dto';
import { WorkItem } from '../../core/models/work-item/work-item';
import { WorkItemQuery } from '../../core/models/work-item/work-item-query';
import { WorkItemHttpService } from '../../core/services/http/work-item-http/work-item-http.service';
import { GenericUtility } from '../../core/utilities/generic-utility/generic-utility';

const workItemHttpService = new WorkItemHttpService();

export interface IWorkItemState {
    pendingWorkItem: WorkItemDto | null;
    editedWorkItem: WorkItem | null;
    editedWorkItemMeta: WorkItemDto | null;
    workItems: WorkItemDto[];
}

const state = (): IWorkItemState => ({
    pendingWorkItem: null,
    editedWorkItem: null,
    editedWorkItemMeta: null,
    workItems: []
});

const getters = {
    pendingWorkItem: (state: IWorkItemState): WorkItemDto | null => state.pendingWorkItem,
    editedWorkItem: (state: IWorkItemState): WorkItem | null => state.editedWorkItem,
    editedWorkItemMeta: (state: IWorkItemState): WorkItemDto | null => {
        const id = state.editedWorkItem?.id ?? '';

        return id ? state.workItems.find(_ => _.id === id) ?? null : null;
    },
    workItems: (state: IWorkItemState): WorkItemDto[] => state.workItems
};

const mutations = {
    setPendingWorkItem(state: IWorkItemState, item: WorkItemDto | null): void {
        state.pendingWorkItem = item;
    },
    setEditedWorkItem(state: IWorkItemState, item: WorkItem | null): void {
        state.editedWorkItem = item;
    },
    setWorkItem(state: IWorkItemState, item: WorkItemDto): void {
        const index = state.workItems.findIndex(_ => _.id === item.id);

        if (index !== -1) {
            state.workItems = GenericUtility.replaceAt(state.workItems, item, index);
        }
    },
    deleteWorkItem(state: IWorkItemState, id: string): void {
        state.workItems = state.workItems.filter(_ => _.id !== id);
    },
    setWorkItems(state: IWorkItemState, items: WorkItemDto[]): void {
        state.workItems = items.slice();
    }
};

const actions = {
    async createWorkItem(context: ActionContext<IWorkItemState, any>): Promise<boolean> {
        const { state, commit } = context;

        if (!state.pendingWorkItem || !await workItemHttpService.createWorkItem(state.pendingWorkItem)) {
            return false;
        }

        commit('setPendingWorkItem', null);

        return true;
    },
    async deleteWorkItem(context: ActionContext<IWorkItemState, any>, id: string): Promise<boolean> {
        if (!await workItemHttpService.deleteWorkItem(id)) {
            return false;
        }

        const { state, commit } = context;
        commit('deleteWorkItem', id);

        if (state.editedWorkItem?.id === id) {
            commit('setEditedWorkItem', null);
        }

        return true;
    },
    async updateWorkItemMeta(context: ActionContext<IWorkItemState, any>, payload: WorkItemDto): Promise<boolean> {
        const updated = await workItemHttpService.updateWorkItemMeta(payload);

        if (updated) {
            context.commit('setWorkItem', updated);
        }

        return Boolean(updated);
    },
    async loadEditedWorkItem(context: ActionContext<IWorkItemState, any>, id: string): Promise<void> {
        context.commit('setEditedWorkItem', await workItemHttpService.getWorkItem(id));
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
