import { MutationTree } from 'vuex';

import { WorkItemDto } from '../../core/dtos/work-item-dto';
import { WorkItem } from '../../core/models/work-item/work-item';
import { WorkItemQuery } from '../../core/models/work-item/work-item-query';
import { GenericUtility } from '../../core/utilities/generic-utility/generic-utility';

import { IState } from './work-item.state';

export enum MutationKey {
    SetLastQuery = 'set_last_query',
    SetPendingWorkItem = 'set_pending_work_item',
    SetEditedWorkItem = 'set_edited_work_item',
    SetWorkItem = 'set_work_item',
    DeleteWorkItem = 'delete_work_item',
    SetWorkItems = 'set_work_items'
}

export interface IMutations {
    [MutationKey.SetLastQuery](state: IState, query: WorkItemQuery | null): void;
    [MutationKey.SetPendingWorkItem](state: IState, item: WorkItemDto | null): void;
    [MutationKey.SetEditedWorkItem](state: IState, item: WorkItem | null): void;
    [MutationKey.SetWorkItem](state: IState, item: WorkItemDto): void;
    [MutationKey.DeleteWorkItem](state: IState, id: string): void;
    [MutationKey.SetWorkItems](state: IState, items: WorkItemDto[]): void;
}

export const mutations: MutationTree<IState> & IMutations = {
    [MutationKey.SetLastQuery](state: IState, query: WorkItemQuery | null): void {
        state.lastQuery = query;
    },
    [MutationKey.SetPendingWorkItem](state: IState, item: WorkItemDto | null): void {
        state.pendingWorkItem = item;
    },
    [MutationKey.SetEditedWorkItem](state: IState, item: WorkItem | null): void {
        state.editedWorkItem = item;
    },
    [MutationKey.SetWorkItem](state: IState, item: WorkItemDto): void {
        const index = state.workItems.findIndex(_ => _.id === item.id);

        if (index !== -1) {
            state.workItems = GenericUtility.replaceAt(state.workItems, item, index);
        }
    },
    [MutationKey.DeleteWorkItem](state: IState, id: string): void {
        state.workItems = state.workItems.filter(_ => _.id !== id);
    },
    [MutationKey.SetWorkItems](state: IState, items: WorkItemDto[]): void {
        state.workItems = items.slice();
    }
};
