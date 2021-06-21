import axios from 'axios';

import { FocusSessionDto } from '../../../dtos/focus-session-dto';
import { BreakSession } from '../../../models/time-session/break-session';

export class TimeSessionHttpService {
    private readonly _api = `${process.env.VUE_APP_BASE_API_URL}/time-session`;

    public async getFocusSessionMeta(id: string): Promise<FocusSessionDto | null> {
        try {
            return (await axios.get(`${this._api}/focus-session/${id}/meta`)).data;
        }
        catch {
            return null;
        }
    }

    public async getBreakSession(id: string): Promise<BreakSession | null> {
        try {
            return (await axios.get(`${this._api}/break-session/${id}`)).data;
        }
        catch {
            return null;
        }
    }
}
