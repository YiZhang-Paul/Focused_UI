import { ActionContext, ActionTree } from 'vuex';

import { WorkItemDto } from '../../core/dtos/work-item-dto';
import { WorkItem } from '../../core/models/work-item/work-item';
import { WorkItemQuery } from '../../core/models/work-item/work-item-query';
import { WorkItemHttpService } from '../../core/services/http/work-item-http/work-item-http.service';

import { IState } from './work-item.state';
import { Mutations, MutationKey } from './work-item.mutations';

let workItemHttpService: WorkItemHttpService;

export enum ActionKey {
    CreateWorkItem = 'create_work_item',
    UpdateWorkItem = 'update_work_item',
    DeleteWorkItem = 'delete_work_item',
    UpdateWorkItemMeta = 'update_work_item_meta',
    LoadEditedWorkItem = 'load_edited_work_item',
    LoadWorkItems = 'load_work_items',
    ReloadWorkItems = 'reload_work_items'
}

interface ActionAugments extends Omit<ActionContext<IState, IState>, 'commit'> {
    commit<T extends keyof Mutations>(key: T, payload: Parameters<Mutations[T]>[1]): ReturnType<Mutations[T]>;
}

export type Actions = {
    [ActionKey.CreateWorkItem](context: ActionAugments): Promise<string | null>;
    [ActionKey.UpdateWorkItem](context: ActionAugments, payload: WorkItem): Promise<boolean>;
    [ActionKey.DeleteWorkItem](context: ActionAugments, id: string): Promise<boolean>;
    [ActionKey.UpdateWorkItemMeta](context: ActionAugments, payload: WorkItemDto): Promise<boolean>;
    [ActionKey.LoadEditedWorkItem](context: ActionAugments, id: string): Promise<void>;
    [ActionKey.LoadWorkItems](context: ActionAugments, payload: WorkItemQuery | null): Promise<void>;
    [ActionKey.ReloadWorkItems](context: ActionAugments): Promise<void>;
}

export const setActionServices = (workItemHttp: WorkItemHttpService): void => {
    workItemHttpService = workItemHttp;
}

export const actions: ActionTree<IState, IState> & Actions = {
    async [ActionKey.CreateWorkItem](context: ActionAugments): Promise<string | null> {
        const { state, commit } = context;

        if (!state.pendingWorkItem) {
            return null;
        }

        const id = await workItemHttpService.createWorkItem(state.pendingWorkItem);

        if (id) {
            commit(MutationKey.SetPendingWorkItem, null);
        }

        return id;
    },
    async [ActionKey.UpdateWorkItem](context: ActionAugments, payload: WorkItem): Promise<boolean> {
        const updated = await workItemHttpService.updateWorkItem(payload);

        if (!updated) {
            return false;
        }

        const { state, commit } = context;
        const meta = await workItemHttpService.getWorkItemMeta(updated.id);

        if (meta) {
            commit(MutationKey.SetWorkItem, meta);
        }

        if (updated.id === state.editedWorkItem?.id) {
            commit(MutationKey.SetEditedWorkItem, updated);
        }

        return true;
    },
    async [ActionKey.DeleteWorkItem](context: ActionAugments, id: string): Promise<boolean> {
        if (!await workItemHttpService.deleteWorkItem(id)) {
            return false;
        }

        const { state, commit } = context;
        commit(MutationKey.DeleteWorkItem, id);

        if (state.editedWorkItem?.id === id) {
            commit(MutationKey.SetEditedWorkItem, null);
        }

        return true;
    },
    async [ActionKey.UpdateWorkItemMeta](context: ActionAugments, payload: WorkItemDto): Promise<boolean> {
        const updated = await workItemHttpService.updateWorkItemMeta(payload);

        if (updated) {
            context.commit(MutationKey.SetWorkItem, updated);
        }

        return Boolean(updated);
    },
    async [ActionKey.LoadEditedWorkItem](context: ActionAugments, id: string): Promise<void> {
        context.commit(MutationKey.SetEditedWorkItem, await workItemHttpService.getWorkItem(id));
    },
    async [ActionKey.LoadWorkItems](context: ActionAugments, payload: WorkItemQuery | null): Promise<void> {
        const query = payload ?? new WorkItemQuery();
        context.commit(MutationKey.SetLastQuery, query);
        context.commit(MutationKey.SetWorkItems, await workItemHttpService.getWorkItems(query));
    },
    async [ActionKey.ReloadWorkItems](context: ActionAugments): Promise<void> {
        context.dispatch(ActionKey.LoadWorkItems, context.state.lastQuery);
    }
};
