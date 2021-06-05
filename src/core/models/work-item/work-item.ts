import { WorkItemType } from '../../enums/work-item-type.enum';
import { WorkItemPriority } from '../../enums/work-item-priority.enum';
import { TimeInfo } from '../generic/time-info';

import { ChecklistEntry } from './checklist-entry';

export class WorkItem {
    public parent: string | null = null;
    public name = '';
    public description = '';
    public type = WorkItemType.Regular;
    public priority = WorkItemPriority.NotUrgentNotImportant;
    public estimation = 0;
    public recur: boolean[] = [];
    public checklist: ChecklistEntry[] = [];
    public timeInfo = new TimeInfo();
    public isCompleted = false;
}
