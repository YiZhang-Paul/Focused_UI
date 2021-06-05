import axios from 'axios';

import { WorkItemDto } from '../../../dtos/work-item-dto';

export class WorkItemHttpService {
    private readonly _api = `${process.env.VUE_APP_BASE_API_URL}/work-items`;

    public async getWorkItems(): Promise<WorkItemDto[]> {
        try {
            return (await axios.get(this._api)).data;
        }
        catch {
            return [];
        }
    }
}
