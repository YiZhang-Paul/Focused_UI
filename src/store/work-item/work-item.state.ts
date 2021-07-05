import { ActionContext } from 'vuex';

import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { timeSessionKey } from '../../store/time-session/time-session.state';
import { WorkItemDto } from '../../core/dtos/work-item-dto';
import { WorkItem } from '../../core/models/work-item/work-item';
import { WorkItemQuery } from '../../core/models/work-item/work-item-query';
import { WorkItemStatus } from '../../core/enums/work-item-status.enum';
import { WorkItemHttpService } from '../../core/services/http/work-item-http/work-item-http.service';
import { GenericUtility } from '../../core/utilities/generic-utility/generic-utility';

let workItemHttpService: WorkItemHttpService;

export interface IWorkItemState {
    lastQuery: WorkItemQuery | null;
    pendingWorkItem: WorkItemDto | null;
    editedWorkItem: WorkItem | null;
    workItems: WorkItemDto[];
}

const state = (): IWorkItemState => ({
    lastQuery: null,
    pendingWorkItem: null,
    editedWorkItem: null,
    workItems: []
});

const getters = {
    pendingWorkItem: (state: IWorkItemState): WorkItemDto | null => state.pendingWorkItem,
    editedWorkItem: (state: IWorkItemState): WorkItem | null => state.editedWorkItem,
    editedWorkItemMeta: (state: IWorkItemState): WorkItemDto | null => {
        const id = state.editedWorkItem?.id ?? '';

        return id ? state.workItems.find(_ => _.id === id) ?? null : null;
    },
    workItems: (state: IWorkItemState): WorkItemDto[] => {
        return state.workItems.slice().sort((a, b) => {
            if (a.priority === b.priority) {
                return b.type - a.type;
            }

            return a.priority - b.priority;
        });
    }
};

const mutations = {
    setLastQuery(state: IWorkItemState, query: WorkItemQuery | null): void {
        state.lastQuery = query;
    },
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
    async createWorkItem(context: ActionContext<IWorkItemState, any>): Promise<string | null> {
        const { state, commit } = context;

        if (!state.pendingWorkItem) {
            return null;
        }

        const id = await workItemHttpService.createWorkItem(state.pendingWorkItem);

        if (id) {
            commit('setPendingWorkItem', null);
        }

        return id;
    },
    async updateWorkItem(context: ActionContext<IWorkItemState, any>, payload: WorkItem): Promise<boolean> {
        const updated = await workItemHttpService.updateWorkItem(payload);

        if (!updated) {
            return false;
        }

        const { state, commit } = context;
        const meta = await workItemHttpService.getWorkItemMeta(updated.id);

        if (meta) {
            commit('setWorkItem', meta);
        }

        if (updated.id === state.editedWorkItem?.id) {
            commit('setEditedWorkItem', updated);
        }

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
    async startWorkItem(context: ActionContext<IWorkItemState, any>, id: string): Promise<boolean> {
        const { state, dispatch } = context;
        const isStarted = await workItemHttpService.startWorkItem(id);

        if (isStarted) {
            dispatch('loadWorkItems', state.lastQuery);
            dispatch(`${timeSessionKey}/loadActiveTimeSession`, null, { root: true });
        }

        return isStarted;
    },
    async stopWorkItem(context: ActionContext<IWorkItemState, any>, targetStatus: WorkItemStatus): Promise<boolean> {
        const { state, dispatch } = context;
        const isStopped = await workItemHttpService.stopWorkItem(targetStatus);

        if (isStopped) {
            dispatch('loadWorkItems', state.lastQuery);
            dispatch(`${timeSessionKey}/loadActiveTimeSession`, null, { root: true });
        }

        return isStopped;
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
        context.commit('setLastQuery', query);
        context.commit('setWorkItems', await workItemHttpService.getWorkItems(query));
    }
};

export const workItemKey = 'workItem';

export const createStore = () => {
    workItemHttpService = container.get<WorkItemHttpService>(types.WorkItemHttpService);

    return {
        namespaced: true,
        state,
        getters,
        mutations,
        actions
    };
};

export const workItem = createStore();
