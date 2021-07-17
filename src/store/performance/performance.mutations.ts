import { MutationTree } from 'vuex';

import { TimeTrackingBreakdownDto } from '../../core/dtos/time-tracking-breakdown-dto';
import { ActivityBreakdownDto } from '../../core/dtos/activity-breakdown-dto';
import { EstimationBreakdownDto } from '../../core/dtos/estimation-breakdown-dto';
import { DueDateBreakdownDto } from '../../core/dtos/due-date-breakdown-dto';
import { ProgressionCounter } from '../../core/models/generic/progression-counter';

import { IPerformanceState } from './performance.state';

export enum PerformanceMutation {
    SetCurrentDayProgression = 'set_current_day_progression',
    SetCurrentDayTimeTracking = 'set_current_day_time_tracking',
    SetActivityBreakdown = 'set_activity_breakdown',
    SetActivityHistories = 'set_activity_histories',
    SetEstimationBreakdown = 'set_estimation_breakdown',
    SetDueDateBreakdown = 'set_due_date_breakdown'
}

export interface IPerformanceMutations {
    [PerformanceMutation.SetCurrentDayProgression](state: IPerformanceState, progression: ProgressionCounter<number> | null): void;
    [PerformanceMutation.SetCurrentDayTimeTracking](state: IPerformanceState, tracking: TimeTrackingBreakdownDto | null): void;
    [PerformanceMutation.SetActivityBreakdown](state: IPerformanceState, breakdown: ActivityBreakdownDto | null): void;
    [PerformanceMutation.SetActivityHistories](state: IPerformanceState, histories: ActivityBreakdownDto[]): void;
    [PerformanceMutation.SetEstimationBreakdown](state: IPerformanceState, breakdown: EstimationBreakdownDto | null): void;
    [PerformanceMutation.SetDueDateBreakdown](state: IPerformanceState, breakdown: DueDateBreakdownDto | null): void;
}

export const mutations: MutationTree<IPerformanceState> & IPerformanceMutations = {
    [PerformanceMutation.SetCurrentDayProgression](state: IPerformanceState, progression: ProgressionCounter<number> | null): void {
        state.currentDayProgression = progression;
    },
    [PerformanceMutation.SetCurrentDayTimeTracking](state: IPerformanceState, tracking: TimeTrackingBreakdownDto | null): void {
        state.currentDayTimeTracking = tracking;
    },
    [PerformanceMutation.SetActivityBreakdown](state: IPerformanceState, breakdown: ActivityBreakdownDto | null): void {
        state.activityBreakdown = breakdown;
    },
    [PerformanceMutation.SetActivityHistories](state: IPerformanceState, histories: ActivityBreakdownDto[]): void {
        state.activityHistories = histories;
    },
    [PerformanceMutation.SetEstimationBreakdown](state: IPerformanceState, breakdown: EstimationBreakdownDto | null): void {
        state.estimationBreakdown = breakdown;
    },
    [PerformanceMutation.SetDueDateBreakdown](state: IPerformanceState, breakdown: DueDateBreakdownDto | null): void {
        state.dueDateBreakdown = breakdown;
    }
};
