import axios from 'axios';

import { WorkItemDto } from '../../../dtos/work-item-dto';
import { WorkItem } from '../../../models/work-item/work-item';
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

    public async getWorkItem(id: string): Promise<WorkItem | null> {
        try {
            return (await axios.get(`${this._api}/${id}`)).data;
        }
        catch {
            return null;
        }
    }

    public async updateWorkItemMeta(item: WorkItemDto): Promise<WorkItemDto | null> {
        try {
            return (await axios.put(`${this._api}/${item.id}/meta`, item)).data;
        }
        catch {
            return null;
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
