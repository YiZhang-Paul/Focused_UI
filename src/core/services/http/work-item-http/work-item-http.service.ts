import axios from 'axios';
import { injectable } from 'inversify';

import { WorkItemDto } from '../../../dtos/work-item-dto';
import { WorkItem } from '../../../models/work-item/work-item';
import { WorkItemQuery } from '../../../models/work-item/work-item-query';

@injectable()
export class WorkItemHttpService {
    private readonly _api = `${process.env.VUE_APP_BASE_API_URL}/work-items`;

    public async createWorkItem(item: WorkItemDto): Promise<string | null> {
        try {
            return (await axios.post(this._api, item)).data;
        }
        catch {
            return null;
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

    public async updateWorkItem(item: WorkItem): Promise<WorkItem | null> {
        try {
            return (await axios.put(this._api, item)).data;
        }
        catch {
            return null;
        }
    }

    public async deleteWorkItem(id: string): Promise<boolean> {
        try {
            return (await axios.delete(`${this._api}/${id}`)).data;
        }
        catch {
            return false;
        }
    }

    public async startWorkItem(id: string): Promise<boolean> {
        try {
            return (await axios.post(`${this._api}/${id}/start`)).data;
        }
        catch {
            return false;
        }
    }

    public async stopWorkItem(): Promise<boolean> {
        try {
            return (await axios.post(`${this._api}/stop`)).data;
        }
        catch {
            return false;
        }
    }

    public async getWorkItemMeta(id: string): Promise<WorkItemDto | null> {
        try {
            return (await axios.get(`${this._api}/${id}/meta`)).data;
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

    public async updateWorkItemMeta(item: WorkItemDto): Promise<WorkItemDto | null> {
        try {
            return (await axios.put(`${this._api}/meta`, item)).data;
        }
        catch {
            return null;
        }
    }
}
