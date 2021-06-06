import axios from 'axios';

import { WorkItemDto } from '../../../dtos/work-item-dto';

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

    public async getWorkItems(): Promise<WorkItemDto[]> {
        try {
            return (await axios.get(this._api)).data;
        }
        catch {
            return [];
        }
    }
}
