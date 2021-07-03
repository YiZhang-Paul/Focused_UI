import { ProgressionCounter } from '../models/generic/progression-counter';
import { WorkItemType } from '../enums/work-item-type.enum';
import { WorkItemPriority } from '../enums/work-item-priority.enum';
import { WorkItemStatus } from '../enums/work-item-status.enum';

export class WorkItemDto {
    public id!: string;
    public userId!: string;
    public name = '';
    public description = '';
    public type = WorkItemType.Regular;
    public priority = WorkItemPriority.NotUrgentNotImportant;
    public status = WorkItemStatus.Idle;
    public dueDate?: string;
    public itemProgress = new ProgressionCounter<number>();
    public subtaskProgress = new ProgressionCounter<number>();
    public checklistProgress = new ProgressionCounter<number>();
}
