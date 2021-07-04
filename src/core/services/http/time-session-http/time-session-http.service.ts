import axios from 'axios';
import { injectable } from 'inversify';

import { FocusSessionDto } from '../../../dtos/focus-session-dto';
import { BreakSession } from '../../../models/time-session/break-session';
import { FocusSessionStartupOption } from '../../../models/time-session/focus-session-startup-option';
import { BreakSessionStartupOption } from '../../../models/time-session/break-session-startup-option';

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

    public async getStaleFocusSessionMeta(): Promise<FocusSessionDto | null> {
        try {
            return (await axios.get(`${this._api}/stale-focus-session/meta`)).data;
        }
        catch {
            return null;
        }
    }

    public async startFocusSession(option: FocusSessionStartupOption): Promise<boolean> {
        try {
            return (await axios.post(`${this._api}/focus-session/start`, option)).data;
        }
        catch {
            return false;
        }
    }

    public async stopFocusSession(id: string): Promise<boolean> {
        try {
            return (await axios.post(`${this._api}/focus-session/${id}/stop`)).data;
        }
        catch {
            return false;
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

    public async getStaleBreakSession(): Promise<BreakSession | null> {
        try {
            return (await axios.get(`${this._api}/stale-break-session`)).data;
        }
        catch {
            return null;
        }
    }

    public async startBreakSession(option: BreakSessionStartupOption): Promise<boolean> {
        try {
            return (await axios.post(`${this._api}/break-session/start`, option)).data;
        }
        catch {
            return false;
        }
    }

    public async stopBreakSession(id: string): Promise<boolean> {
        try {
            return (await axios.post(`${this._api}/break-session/${id}/stop`)).data;
        }
        catch {
            return false;
        }
    }
}
