import axios from 'axios';

import { FocusSession } from '../../../models/time-session/focus-session';

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
}
