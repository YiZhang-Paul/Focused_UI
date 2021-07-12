import { WorkItemType } from '../../enums/work-item-type.enum';
import { WorkItemPriority } from '../../enums/work-item-priority.enum';
import { WorkItemStatus } from '../../enums/work-item-status.enum';
import { TimeInfo } from '../generic/time-info';

import { ChecklistEntry } from './checklist-entry';
import { CompletionRecord } from './completion-record';

export class WorkItem {
    public id!: string;
    public userId!: string;
    public subtasks: WorkItem[] = [];
    public name = '';
    public description = '';
    public type = WorkItemType.Regular;
    public priority = WorkItemPriority.NotUrgentNotImportant;
    public status = WorkItemStatus.Idle;
    public estimatedHours = 0;
    public dueDate?: string;
    public recur: boolean[] = [];
    public checklist: ChecklistEntry[] = [];
    public completionRecords: CompletionRecord[] = [];
    public timeInfo = new TimeInfo();
}
