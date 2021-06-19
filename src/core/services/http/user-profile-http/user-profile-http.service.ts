import axios from 'axios';

import { UserProfile } from '../../../models/user/user-profile';

export class UserProfileHttpService {
    private readonly _api = `${process.env.VUE_APP_BASE_API_URL}/user-profile`;

    public async getUserProfile(id: string): Promise<UserProfile | null> {
        try {
            return (await axios.get(`${this._api}/${id}`)).data;
        }
        catch {
            return null;
        }
    }
}
