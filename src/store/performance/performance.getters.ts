import { GetterTree } from 'vuex';

import { TimeTrackingBreakdownDto } from '../../core/dtos/time-tracking-breakdown-dto';
import { ActivityBreakdownDto } from '../../core/dtos/activity-breakdown-dto';
import { EstimationBreakdownDto } from '../../core/dtos/estimation-breakdown-dto';
import { DueDateBreakdownDto } from '../../core/dtos/due-date-breakdown-dto';
import { DateRange } from '../../core/models/generic/date-range';
import { ProgressionCounter } from '../../core/models/generic/progression-counter';

import { IPerformanceState } from './performance.state';

export enum PerformanceGetter {
    DateRange = 'date_range',
    CurrentDayProgression = 'current_day_progression',
    CurrentDayTimeTracking = 'current_day_time_tracking',
    ActivityBreakdown = 'activity_breakdown',
    ActivityHistories = 'activity_histories',
    EstimationBreakdown = 'estimation_breakdown',
    DueDateBreakdown = 'due_date_breakdown'
}

export interface IPerformanceGetters {
    [PerformanceGetter.DateRange](state: IPerformanceState): DateRange;
    [PerformanceGetter.CurrentDayProgression](state: IPerformanceState): ProgressionCounter<number> | null;
    [PerformanceGetter.CurrentDayTimeTracking](state: IPerformanceState): TimeTrackingBreakdownDto | null;
    [PerformanceGetter.ActivityBreakdown](state: IPerformanceState): ActivityBreakdownDto | null;
    [PerformanceGetter.ActivityHistories](state: IPerformanceState): ActivityBreakdownDto[];
    [PerformanceGetter.EstimationBreakdown](state: IPerformanceState): EstimationBreakdownDto | null;
    [PerformanceGetter.DueDateBreakdown](state: IPerformanceState): DueDateBreakdownDto | null;
}

export const getters: GetterTree<IPerformanceState, IPerformanceState> & IPerformanceGetters = {
    [PerformanceGetter.DateRange]: (state: IPerformanceState): DateRange => state.dateRange,
    [PerformanceGetter.CurrentDayProgression]: (state: IPerformanceState): ProgressionCounter<number> | null => state.currentDayProgression,
    [PerformanceGetter.CurrentDayTimeTracking]: (state: IPerformanceState): TimeTrackingBreakdownDto | null => state.currentDayTimeTracking,
    [PerformanceGetter.ActivityBreakdown]: (state: IPerformanceState): ActivityBreakdownDto | null => state.activityBreakdown,
    [PerformanceGetter.ActivityHistories]: (state: IPerformanceState): ActivityBreakdownDto[] => state.activityHistories,
    [PerformanceGetter.EstimationBreakdown]: (state: IPerformanceState): EstimationBreakdownDto | null => state.estimationBreakdown,
    [PerformanceGetter.DueDateBreakdown]: (state: IPerformanceState): DueDateBreakdownDto | null => state.dueDateBreakdown
};
