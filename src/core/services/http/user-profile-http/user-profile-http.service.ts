import axios from 'axios';
import { injectable } from 'inversify';

import { UserProfile } from '../../../models/user/user-profile';
import { PerformanceRating } from '../../../models/user/performance-rating';

@injectable()
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

    public async updateUserRatings(id: string): Promise<PerformanceRating | null> {
        try {
            return (await axios.put(`${this._api}/${id}/ratings`)).data;
        }
        catch {
            return null;
        }
    }
}
