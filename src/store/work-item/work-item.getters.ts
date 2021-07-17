import { GetterTree } from 'vuex';

import { WorkItemDto } from '../../core/dtos/work-item-dto';
import { WorkItem } from '../../core/models/work-item/work-item';

import { IWorkItemState } from './work-item.state';

export enum WorkItemGetter {
    PendingWorkItem = 'pending_work_item',
    EditedWorkItem = 'edited_work_item',
    EditedWorkItemMeta = 'edited_work_item_meta',
    WorkItems = 'work_items'
}

export interface IWorkItemGetters {
    [WorkItemGetter.PendingWorkItem](state: IWorkItemState): WorkItemDto | null;
    [WorkItemGetter.EditedWorkItem](state: IWorkItemState): WorkItem | null;
    [WorkItemGetter.EditedWorkItemMeta](state: IWorkItemState): WorkItemDto | null;
    [WorkItemGetter.WorkItems](state: IWorkItemState): WorkItemDto[];
}

export const getters: GetterTree<IWorkItemState, IWorkItemState> & IWorkItemGetters = {
    [WorkItemGetter.PendingWorkItem]: (state: IWorkItemState): WorkItemDto | null => state.pendingWorkItem,
    [WorkItemGetter.EditedWorkItem]: (state: IWorkItemState): WorkItem | null => state.editedWorkItem,
    [WorkItemGetter.EditedWorkItemMeta]: (state: IWorkItemState): WorkItemDto | null => {
        const id = state.editedWorkItem?.id ?? '';

        return id ? state.workItems.find(_ => _.id === id) ?? null : null;
    },
    [WorkItemGetter.WorkItems]: (state: IWorkItemState): WorkItemDto[] => {
        return state.workItems.slice().sort((a, b) => {
            if (a.priority === b.priority) {
                return b.type - a.type;
            }

            return a.priority - b.priority;
        });
    }
};
