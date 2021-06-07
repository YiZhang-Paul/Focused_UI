import axios from 'axios';

import { ActivityBreakdownDto } from '../../../dtos/activity-breakdown-dto';
import { ProgressionCounter } from '../../../models/generic/progression-counter';

export class PerformanceHttpService {
    private readonly _api = `${process.env.VUE_APP_BASE_API_URL}/performance`;

    public async getDailyProgression(year: number, month: number, day: number): Promise<ProgressionCounter<number>> {
        try {
            const endpoint = `${this._api}/daily-progression/${year}/${month}/${day}`;

            return (await axios.get(endpoint)).data;
        }
        catch {
            return {
                current: 0,
                target: 8,
                isCompleted: false
            } as ProgressionCounter<number>;
        }
    }

    public async getDailyActivityBreakdown(year: number, month: number, day: number): Promise<ActivityBreakdownDto> {
        try {
            const endpoint = `${this._api}/daily-activity-breakdown/${year}/${month}/${day}`;

            return (await axios.get(endpoint)).data;
        }
        catch {
            return new ActivityBreakdownDto();
        }
    }
}
