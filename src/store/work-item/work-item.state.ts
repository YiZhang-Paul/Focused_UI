import { WorkItemDto } from '../../core/dtos/work-item-dto';
import { WorkItem } from '../../core/models/work-item/work-item';
import { WorkItemQuery } from '../../core/models/work-item/work-item-query';

export interface IState {
    lastQuery: WorkItemQuery | null;
    pendingWorkItem: WorkItemDto | null;
    editedWorkItem: WorkItem | null;
    workItems: WorkItemDto[];
}

export const state = (): IState => ({
    lastQuery: null,
    pendingWorkItem: null,
    editedWorkItem: null,
    workItems: []
});
