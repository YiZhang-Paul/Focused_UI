import { TimeTrackingBreakdownDto } from '../../core/dtos/time-tracking-breakdown-dto';
import { ActivityBreakdownDto } from '../../core/dtos/activity-breakdown-dto';
import { EstimationBreakdownDto } from '../../core/dtos/estimation-breakdown-dto';
import { DueDateBreakdownDto } from '../../core/dtos/due-date-breakdown-dto';
import { DateRange } from '../../core/models/generic/date-range';
import { ProgressionCounter } from '../../core/models/generic/progression-counter';

const oneDay = 24 * 60 * 60 * 1000;

function getDateRange(): DateRange {
    const end = new Date(Date.now() + oneDay);
    end.setHours(0, 0, 0, 0);

    return { start: new Date(end.getTime() - 14 * oneDay), end };
}

export interface IState {
    dateRange: DateRange;
    currentDayProgression: ProgressionCounter<number> | null;
    currentDayTimeTracking: TimeTrackingBreakdownDto | null;
    activityBreakdown: ActivityBreakdownDto | null;
    activityHistories: ActivityBreakdownDto[];
    estimationBreakdown: EstimationBreakdownDto | null;
    dueDateBreakdown: DueDateBreakdownDto | null;
}

export const state = (): IState => ({
    dateRange: getDateRange(),
    currentDayProgression: null,
    currentDayTimeTracking: null,
    activityBreakdown: null,
    activityHistories: [],
    estimationBreakdown: null,
    dueDateBreakdown: null
});
