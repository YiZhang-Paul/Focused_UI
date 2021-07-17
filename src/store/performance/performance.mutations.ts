import { MutationTree } from 'vuex';

import { TimeTrackingBreakdownDto } from '../../core/dtos/time-tracking-breakdown-dto';
import { ActivityBreakdownDto } from '../../core/dtos/activity-breakdown-dto';
import { EstimationBreakdownDto } from '../../core/dtos/estimation-breakdown-dto';
import { DueDateBreakdownDto } from '../../core/dtos/due-date-breakdown-dto';
import { ProgressionCounter } from '../../core/models/generic/progression-counter';

import { IState } from './performance.state';

export enum MutationKey {
    SetCurrentDayProgression = 'set_current_day_progression',
    SetCurrentDayTimeTracking = 'set_current_day_time_tracking',
    SetActivityBreakdown = 'set_activity_breakdown',
    SetActivityHistories = 'set_activity_histories',
    SetEstimationBreakdown = 'set_estimation_breakdown',
    SetDueDateBreakdown = 'set_due_date_breakdown'
}

export interface IMutations {
    [MutationKey.SetCurrentDayProgression](state: IState, progression: ProgressionCounter<number> | null): void;
    [MutationKey.SetCurrentDayTimeTracking](state: IState, tracking: TimeTrackingBreakdownDto | null): void;
    [MutationKey.SetActivityBreakdown](state: IState, breakdown: ActivityBreakdownDto | null): void;
    [MutationKey.SetActivityHistories](state: IState, histories: ActivityBreakdownDto[]): void;
    [MutationKey.SetEstimationBreakdown](state: IState, breakdown: EstimationBreakdownDto | null): void;
    [MutationKey.SetDueDateBreakdown](state: IState, breakdown: DueDateBreakdownDto | null): void;
}

export const mutations: MutationTree<IState> & IMutations = {
    [MutationKey.SetCurrentDayProgression](state: IState, progression: ProgressionCounter<number> | null): void {
        state.currentDayProgression = progression;
    },
    [MutationKey.SetCurrentDayTimeTracking](state: IState, tracking: TimeTrackingBreakdownDto | null): void {
        state.currentDayTimeTracking = tracking;
    },
    [MutationKey.SetActivityBreakdown](state: IState, breakdown: ActivityBreakdownDto | null): void {
        state.activityBreakdown = breakdown;
    },
    [MutationKey.SetActivityHistories](state: IState, histories: ActivityBreakdownDto[]): void {
        state.activityHistories = histories;
    },
    [MutationKey.SetEstimationBreakdown](state: IState, breakdown: EstimationBreakdownDto | null): void {
        state.estimationBreakdown = breakdown;
    },
    [MutationKey.SetDueDateBreakdown](state: IState, breakdown: DueDateBreakdownDto | null): void {
        state.dueDateBreakdown = breakdown;
    }
};
