import { ActivityBreakdownDto } from './activity-breakdown-dto';
import { WorkItemDto } from './work-item-dto';

export class FocusSessionDto {
    public id!: string;
    public userId!: string;
    public startTime = '';
    public endTime = '';
    public activities = new ActivityBreakdownDto();
    public workItems: WorkItemDto[] = [];
}
