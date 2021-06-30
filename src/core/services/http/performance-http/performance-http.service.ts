import axios from 'axios';
import { injectable } from 'inversify';

import { ActivityBreakdownDto } from '../../../dtos/activity-breakdown-dto';
import { EstimationBreakdownDto } from '../../../dtos/estimation-breakdown-dto';
import { DueDateBreakdownDto } from '../../../dtos/due-date-breakdown-dto';
import { TimeTrackingBreakdownDto } from '../../../dtos/time-tracking-breakdown-dto';
import { ProgressionCounter } from '../../../models/generic/progression-counter';

@injectable()
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

    public async getDailyTimeTracking(year: number, month: number, day: number): Promise<TimeTrackingBreakdownDto> {
        try {
            const endpoint = `${this._api}/daily-time-tracking/${year}/${month}/${day}`;

            return (await axios.get(endpoint)).data;
        }
        catch {
            return new TimeTrackingBreakdownDto();
        }
    }

    public async getActivityBreakdownByDateRange(start?: Date, end?: Date): Promise<ActivityBreakdownDto> {
        try {
            const endpoint = `${this._api}/activity-breakdown`;

            return (await axios.get(this.appendDateQueryString(endpoint, start, end))).data;
        }
        catch {
            return new ActivityBreakdownDto();
        }
    }

    public async getActivityBreakdownByDays(start: Date, end: Date): Promise<ActivityBreakdownDto[]> {
        try {
            const dates = [start, end].map(_ => _.toISOString().split('T')[0]).join('/');
            const endpoint = `${this._api}/activity-breakdown/${dates}`;

            return (await axios.get(endpoint)).data;
        }
        catch {
            return [];
        }
    }

    public async getEstimationBreakdown(start?: Date, end?: Date): Promise<EstimationBreakdownDto> {
        try {
            const endpoint = `${this._api}/estimation-breakdown`;

            return (await axios.get(this.appendDateQueryString(endpoint, start, end))).data;
        }
        catch {
            return new EstimationBreakdownDto();
        }
    }

    public async getDueDateBreakdown(start?: Date, end?: Date): Promise<DueDateBreakdownDto> {
        try {
            const endpoint = `${this._api}/due-date-breakdown`;

            return (await axios.get(this.appendDateQueryString(endpoint, start, end))).data;
        }
        catch {
            return new DueDateBreakdownDto();
        }
    }

    private appendDateQueryString(endpoint: string, start?: Date, end?: Date): string {
        const startQuery = start ? `start=${start.toISOString()}` : '';
        const endQuery = end ? `end=${end.toISOString()}` : '';
        const query = [startQuery, endQuery].filter(Boolean).join('&');

        return query ? [endpoint, query].join('?') : endpoint;
    }
}
