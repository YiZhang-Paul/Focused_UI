import { ActionContext, ActionTree } from 'vuex';

import { WorkItemDto } from '../../core/dtos/work-item-dto';
import { WorkItem } from '../../core/models/work-item/work-item';
import { WorkItemQuery } from '../../core/models/work-item/work-item-query';
import { WorkItemHttpService } from '../../core/services/http/work-item-http/work-item-http.service';

import { IWorkItemState } from './work-item.state';
import { IWorkItemMutations, WorkItemMutation } from './work-item.mutations';

let workItemHttpService: WorkItemHttpService;

export enum WorkItemAction {
    CreateWorkItem = 'create_work_item',
    UpdateWorkItem = 'update_work_item',
    DeleteWorkItem = 'delete_work_item',
    UpdateWorkItemMeta = 'update_work_item_meta',
    LoadEditedWorkItem = 'load_edited_work_item',
    LoadWorkItems = 'load_work_items',
    ReloadWorkItems = 'reload_work_items'
}

interface ActionAugments extends Omit<ActionContext<IWorkItemState, IWorkItemState>, 'commit'> {
    commit<T extends keyof IWorkItemMutations>(key: T, payload: Parameters<IWorkItemMutations[T]>[1]): ReturnType<IWorkItemMutations[T]>;
}

export interface IWorkItemActions {
    [WorkItemAction.CreateWorkItem](context: ActionAugments): Promise<string | null>;
    [WorkItemAction.UpdateWorkItem](context: ActionAugments, payload: WorkItem): Promise<boolean>;
    [WorkItemAction.DeleteWorkItem](context: ActionAugments, id: string): Promise<boolean>;
    [WorkItemAction.UpdateWorkItemMeta](context: ActionAugments, payload: WorkItemDto): Promise<boolean>;
    [WorkItemAction.LoadEditedWorkItem](context: ActionAugments, id: string): Promise<void>;
    [WorkItemAction.LoadWorkItems](context: ActionAugments, payload: WorkItemQuery | null): Promise<void>;
    [WorkItemAction.ReloadWorkItems](context: ActionAugments): Promise<void>;
}

export const setActionServices = (workItemHttp: WorkItemHttpService): void => {
    workItemHttpService = workItemHttp;
}

export const actions: ActionTree<IWorkItemState, IWorkItemState> & IWorkItemActions = {
    async [WorkItemAction.CreateWorkItem](context: ActionAugments): Promise<string | null> {
        const { state, commit } = context;

        if (!state.pendingWorkItem) {
            return null;
        }

        const id = await workItemHttpService.createWorkItem(state.pendingWorkItem);

        if (id) {
            commit(WorkItemMutation.SetPendingWorkItem, null);
        }

        return id;
    },
    async [WorkItemAction.UpdateWorkItem](context: ActionAugments, payload: WorkItem): Promise<boolean> {
        const updated = await workItemHttpService.updateWorkItem(payload);

        if (!updated) {
            return false;
        }

        const { state, commit } = context;
        const meta = await workItemHttpService.getWorkItemMeta(updated.id);

        if (meta) {
            commit(WorkItemMutation.SetWorkItem, meta);
        }

        if (updated.id === state.editedWorkItem?.id) {
            commit(WorkItemMutation.SetEditedWorkItem, updated);
        }

        return true;
    },
    async [WorkItemAction.DeleteWorkItem](context: ActionAugments, id: string): Promise<boolean> {
        if (!await workItemHttpService.deleteWorkItem(id)) {
            return false;
        }

        const { state, commit } = context;
        commit(WorkItemMutation.DeleteWorkItem, id);

        if (state.editedWorkItem?.id === id) {
            commit(WorkItemMutation.SetEditedWorkItem, null);
        }

        return true;
    },
    async [WorkItemAction.UpdateWorkItemMeta](context: ActionAugments, payload: WorkItemDto): Promise<boolean> {
        const updated = await workItemHttpService.updateWorkItemMeta(payload);

        if (updated) {
            context.commit(WorkItemMutation.SetWorkItem, updated);
        }

        return Boolean(updated);
    },
    async [WorkItemAction.LoadEditedWorkItem](context: ActionAugments, id: string): Promise<void> {
        context.commit(WorkItemMutation.SetEditedWorkItem, await workItemHttpService.getWorkItem(id));
    },
    async [WorkItemAction.LoadWorkItems](context: ActionAugments, payload: WorkItemQuery | null): Promise<void> {
        const query = payload ?? new WorkItemQuery();
        context.commit(WorkItemMutation.SetLastQuery, query);
        context.commit(WorkItemMutation.SetWorkItems, await workItemHttpService.getWorkItems(query));
    },
    async [WorkItemAction.ReloadWorkItems](context: ActionAugments): Promise<void> {
        context.dispatch(WorkItemAction.LoadWorkItems, context.state.lastQuery);
    }
};
