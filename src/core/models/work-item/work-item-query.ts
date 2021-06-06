import { WorkItemType } from '../../enums/work-item-type.enum';

export class WorkItemQuery {
    public skip = 0;
    public limit = 0;
    public searchText = '';
    public isCompleted?: boolean;
    public type?: WorkItemType;
}
