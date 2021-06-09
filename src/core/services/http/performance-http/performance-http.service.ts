import axios from 'axios';

import { ActivityBreakdownDto } from '../../../dtos/activity-breakdown-dto';
import { EstimationBreakdownDto } from '../../../dtos/estimation-breakdown-dto';
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

    public async getActivityBreakdown(start?: Date, end?: Date): Promise<ActivityBreakdownDto> {
        try {
            const endpoint = `${this._api}/activity-breakdown`;
            const startQuery = start ? `start=${start.toISOString()}` : '';
            const endQuery = end ? `end=${end.toISOString()}` : '';
            const queries = [startQuery, endQuery].filter(Boolean);
            const queryString = queries.length ? `?${queries.join('&')}` : '';

            return (await axios.get(endpoint + queryString)).data;
        }
        catch {
            return new ActivityBreakdownDto();
        }
    }

    public async getEstimationBreakdown(start?: Date, end?: Date): Promise<EstimationBreakdownDto> {
        try {
            const endpoint = `${this._api}/estimation-breakdown`;
            const startQuery = start ? `start=${start.toISOString()}` : '';
            const endQuery = end ? `end=${end.toISOString()}` : '';
            const queries = [startQuery, endQuery].filter(Boolean);
            const queryString = queries.length ? `?${queries.join('&')}` : '';

            return (await axios.get(endpoint + queryString)).data;
        }
        catch {
            return new EstimationBreakdownDto();
        }
    }
}
