import { ProgressionCounter } from '../models/generic/progression-counter';
import { WorkItemType } from '../enums/work-item-type.enum';
import { WorkItemPriority } from '../enums/work-item-priority.enum';
import { WorkItemStatus } from '../enums/work-item-status.enum';

export class WorkItemDto {
    public id!: string;
    public name = '';
    public type = WorkItemType.Regular;
    public priority = WorkItemPriority.NotUrgentNotImportant;
    public status = WorkItemStatus.Idle;
    public estimatedHours = 0;
    public actualHours = 0;
    public subtaskProgress = new ProgressionCounter<number>();
    public checklistProgress = new ProgressionCounter<number>();
}
