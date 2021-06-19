import { WorkItemType } from '../../enums/work-item-type.enum';
import { WorkItemPriority } from '../../enums/work-item-priority.enum';
import { WorkItemStatus } from '../../enums/work-item-status.enum';
import { TimeInfo } from '../generic/time-info';

import { TimeSeries } from './time-series';
import { ChecklistEntry } from './checklist-entry';

export class WorkItem {
    public id!: string;
    public parent: string | null = null;
    public subtasks: WorkItem[] = [];
    public name = '';
    public description = '';
    public type = WorkItemType.Regular;
    public priority = WorkItemPriority.NotUrgentNotImportant;
    public status = WorkItemStatus.Idle;
    public estimatedHours = 0;
    public timeSeries = new TimeSeries();
    public dueDate?: string;
    public recur: boolean[] = [];
    public checklist: ChecklistEntry[] = [];
    public timeInfo = new TimeInfo();
}
