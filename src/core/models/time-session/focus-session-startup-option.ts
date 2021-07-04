import { WorkItemDto } from '../../dtos/work-item-dto';

export class FocusSessionStartupOption {
    public totalMinutes = 25;
    public startingItem: WorkItemDto;

    constructor(startingItem: WorkItemDto) {
        this.startingItem = startingItem;
    }
}
