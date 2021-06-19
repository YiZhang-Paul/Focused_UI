import { WorkItemType } from '../../enums/work-item-type.enum';

export class WorkItemQuery {
    public skip = 0;
    public limit = 0;
    public searchText = '';
    public type?: WorkItemType;
    public isHighlighted?: boolean;
    public isCompleted?: boolean;
}
