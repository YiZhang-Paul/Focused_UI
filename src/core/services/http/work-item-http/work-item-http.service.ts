import axios from 'axios';

import { WorkItemDto } from '../../../dtos/work-item-dto';
import { WorkItemQuery } from '../../../models/work-item/work-item-query';

export class WorkItemHttpService {
    private readonly _api = `${process.env.VUE_APP_BASE_API_URL}/work-items`;

    public async createWorkItem(item: WorkItemDto): Promise<boolean> {
        try {
            return (await axios.post(this._api, item)).data;
        }
        catch {
            return false;
        }
    }

    public async getWorkItems(query: WorkItemQuery): Promise<WorkItemDto[]> {
        try {
            return (await axios.post(`${this._api}/summaries`, query)).data;
        }
        catch {
            return [];
        }
    }
}
