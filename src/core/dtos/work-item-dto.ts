import { ProgressionCounter } from '../models/generic/progression-counter';
import { WorkItemType } from '../enums/work-item-type.enum';
import { WorkItemPriority } from '../enums/work-item-priority.enum';

export class WorkItemDto {
    public name = '';
    public type = WorkItemType.Regular;
    public priority = WorkItemPriority.NotUrgentNotImportant;
    public estimation = 0;
    public subtaskProgress = new ProgressionCounter<number>();
    public checklistProgress = new ProgressionCounter<number>();
}
