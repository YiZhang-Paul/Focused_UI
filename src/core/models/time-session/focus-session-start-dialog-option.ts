import { WorkItemDto } from '@/core/dtos/work-item-dto';

export class FocusSessionStartDialogOption {
    public item: WorkItemDto;
    public duration = 25;

    constructor(item: WorkItemDto) {
        this.item = item;
    }
}
