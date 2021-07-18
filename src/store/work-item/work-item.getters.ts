import { GetterTree } from 'vuex';

import { WorkItemDto } from '../../core/dtos/work-item-dto';
import { WorkItem } from '../../core/models/work-item/work-item';

import { IState } from './work-item.state';

export enum GetterKey {
    PendingWorkItem = 'pending_work_item',
    EditedWorkItem = 'edited_work_item',
    EditedWorkItemMeta = 'edited_work_item_meta',
    WorkItems = 'work_items'
}

export type Getters = {
    [GetterKey.PendingWorkItem](state: IState): WorkItemDto | null;
    [GetterKey.EditedWorkItem](state: IState): WorkItem | null;
    [GetterKey.EditedWorkItemMeta](state: IState): WorkItemDto | null;
    [GetterKey.WorkItems](state: IState): WorkItemDto[];
}

export const getters: GetterTree<IState, IState> & Getters = {
    [GetterKey.PendingWorkItem]: (state: IState): WorkItemDto | null => state.pendingWorkItem,
    [GetterKey.EditedWorkItem]: (state: IState): WorkItem | null => state.editedWorkItem,
    [GetterKey.EditedWorkItemMeta]: (state: IState): WorkItemDto | null => {
        const id = state.editedWorkItem?.id ?? '';

        return id ? state.workItems.find(_ => _.id === id) ?? null : null;
    },
    [GetterKey.WorkItems]: (state: IState): WorkItemDto[] => {
        return state.workItems.slice().sort((a, b) => {
            if (a.priority === b.priority) {
                return b.type - a.type;
            }

            return a.priority - b.priority;
        });
    }
};
