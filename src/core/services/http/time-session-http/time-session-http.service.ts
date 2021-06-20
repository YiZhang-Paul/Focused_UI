import axios from 'axios';

import { FocusSession } from '../../../models/time-session/focus-session';
import { BreakSession } from '../../../models/time-session/break-session';

export class TimeSessionHttpService {
    private readonly _api = `${process.env.VUE_APP_BASE_API_URL}/time-session`;

    public async getFocusSession(id: string): Promise<FocusSession | null> {
        try {
            return (await axios.get(`${this._api}/focus-session/${id}`)).data;
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
