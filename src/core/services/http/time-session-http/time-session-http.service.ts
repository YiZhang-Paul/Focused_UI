import axios from 'axios';
import { injectable } from 'inversify';

import { FocusSessionDto } from '../../../dtos/focus-session-dto';
import { BreakSession } from '../../../models/time-session/break-session';

@injectable()
export class TimeSessionHttpService {
    private readonly _api = `${process.env.VUE_APP_BASE_API_URL}/time-session`;

    public async getActiveFocusSessionMeta(): Promise<FocusSessionDto | null> {
        try {
            return (await axios.get(`${this._api}/active-focus-session/meta`)).data;
        }
        catch {
            return null;
        }
    }

    public async getActiveBreakSession(): Promise<BreakSession | null> {
        try {
            return (await axios.get(`${this._api}/active-break-session`)).data;
        }
        catch {
            return null;
        }
    }
}
