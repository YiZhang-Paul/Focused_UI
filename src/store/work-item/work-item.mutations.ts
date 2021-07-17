import { MutationTree } from 'vuex';

import { WorkItemDto } from '../../core/dtos/work-item-dto';
import { WorkItem } from '../../core/models/work-item/work-item';
import { WorkItemQuery } from '../../core/models/work-item/work-item-query';
import { GenericUtility } from '../../core/utilities/generic-utility/generic-utility';

import { IWorkItemState } from './work-item.state';

export enum WorkItemMutation {
    SetLastQuery = 'set_last_query',
    SetPendingWorkItem = 'set_pending_work_item',
    SetEditedWorkItem = 'set_edited_work_item',
    SetWorkItem = 'set_work_item',
    DeleteWorkItem = 'delete_work_item',
    SetWorkItems = 'set_work_items'
}

export interface IWorkItemMutations {
    [WorkItemMutation.SetLastQuery](state: IWorkItemState, query: WorkItemQuery | null): void;
    [WorkItemMutation.SetPendingWorkItem](state: IWorkItemState, item: WorkItemDto | null): void;
    [WorkItemMutation.SetEditedWorkItem](state: IWorkItemState, item: WorkItem | null): void;
    [WorkItemMutation.SetWorkItem](state: IWorkItemState, item: WorkItemDto): void;
    [WorkItemMutation.DeleteWorkItem](state: IWorkItemState, id: string): void;
    [WorkItemMutation.SetWorkItems](state: IWorkItemState, items: WorkItemDto[]): void;
}

export const mutations: MutationTree<IWorkItemState> & IWorkItemMutations = {
    [WorkItemMutation.SetLastQuery](state: IWorkItemState, query: WorkItemQuery | null): void {
        state.lastQuery = query;
    },
    [WorkItemMutation.SetPendingWorkItem](state: IWorkItemState, item: WorkItemDto | null): void {
        state.pendingWorkItem = item;
    },
    [WorkItemMutation.SetEditedWorkItem](state: IWorkItemState, item: WorkItem | null): void {
        state.editedWorkItem = item;
    },
    [WorkItemMutation.SetWorkItem](state: IWorkItemState, item: WorkItemDto): void {
        const index = state.workItems.findIndex(_ => _.id === item.id);

        if (index !== -1) {
            state.workItems = GenericUtility.replaceAt(state.workItems, item, index);
        }
    },
    [WorkItemMutation.DeleteWorkItem](state: IWorkItemState, id: string): void {
        state.workItems = state.workItems.filter(_ => _.id !== id);
    },
    [WorkItemMutation.SetWorkItems](state: IWorkItemState, items: WorkItemDto[]): void {
        state.workItems = items.slice();
    }
};
