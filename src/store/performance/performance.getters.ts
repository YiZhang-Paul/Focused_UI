import { GetterTree } from 'vuex';

import { TimeTrackingBreakdownDto } from '../../core/dtos/time-tracking-breakdown-dto';
import { ActivityBreakdownDto } from '../../core/dtos/activity-breakdown-dto';
import { EstimationBreakdownDto } from '../../core/dtos/estimation-breakdown-dto';
import { DueDateBreakdownDto } from '../../core/dtos/due-date-breakdown-dto';
import { DateRange } from '../../core/models/generic/date-range';
import { ProgressionCounter } from '../../core/models/generic/progression-counter';

import { IState } from './performance.state';

export enum GetterKey {
    DateRange = 'date_range',
    CurrentDayProgression = 'current_day_progression',
    CurrentDayTimeTracking = 'current_day_time_tracking',
    ActivityBreakdown = 'activity_breakdown',
    ActivityHistories = 'activity_histories',
    EstimationBreakdown = 'estimation_breakdown',
    DueDateBreakdown = 'due_date_breakdown'
}

export type Getters = {
    [GetterKey.DateRange](state: IState): DateRange;
    [GetterKey.CurrentDayProgression](state: IState): ProgressionCounter<number> | null;
    [GetterKey.CurrentDayTimeTracking](state: IState): TimeTrackingBreakdownDto | null;
    [GetterKey.ActivityBreakdown](state: IState): ActivityBreakdownDto | null;
    [GetterKey.ActivityHistories](state: IState): ActivityBreakdownDto[];
    [GetterKey.EstimationBreakdown](state: IState): EstimationBreakdownDto | null;
    [GetterKey.DueDateBreakdown](state: IState): DueDateBreakdownDto | null;
}

export const getters: GetterTree<IState, IState> & Getters = {
    [GetterKey.DateRange]: (state: IState): DateRange => state.dateRange,
    [GetterKey.CurrentDayProgression]: (state: IState): ProgressionCounter<number> | null => state.currentDayProgression,
    [GetterKey.CurrentDayTimeTracking]: (state: IState): TimeTrackingBreakdownDto | null => state.currentDayTimeTracking,
    [GetterKey.ActivityBreakdown]: (state: IState): ActivityBreakdownDto | null => state.activityBreakdown,
    [GetterKey.ActivityHistories]: (state: IState): ActivityBreakdownDto[] => state.activityHistories,
    [GetterKey.EstimationBreakdown]: (state: IState): EstimationBreakdownDto | null => state.estimationBreakdown,
    [GetterKey.DueDateBreakdown]: (state: IState): DueDateBreakdownDto | null => state.dueDateBreakdown
};
