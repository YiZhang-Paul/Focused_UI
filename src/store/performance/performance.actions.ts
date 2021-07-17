import { ActionContext, ActionTree } from 'vuex';

import { PerformanceRating } from '../../core/models/user/performance-rating';
import { PerformanceHttpService } from '../../core/services/http/performance-http/performance-http.service';

import { IPerformanceState } from './performance.state';
import { IPerformanceMutations, PerformanceMutation } from './performance.mutations';

let performanceHttpService: PerformanceHttpService;

export enum PerformanceAction {
    LoadCurrentDayProgression = 'load_current_day_progression',
    LoadCurrentDayTimeTracking = 'load_current_day_time_tracking',
    LoadActivityBreakdown = 'load_activity_breakdown',
    LoadActivityHistories = 'load_activity_histories',
    LoadEstimationBreakdown = 'load_estimation_breakdown',
    LoadDueDateBreakdown = 'load_due_date_breakdown',
    GetPerformanceRating = 'get_performance_rating'
}

interface ActionAugments extends Omit<ActionContext<IPerformanceState, IPerformanceState>, 'commit'> {
    commit<T extends keyof IPerformanceMutations>(key: T, payload: Parameters<IPerformanceMutations[T]>[1]): ReturnType<IPerformanceMutations[T]>;
}

export interface IPerformanceActions {
    [PerformanceAction.LoadCurrentDayProgression](context: ActionAugments): Promise<void>;
    [PerformanceAction.LoadCurrentDayTimeTracking](context: ActionAugments): Promise<void>;
    [PerformanceAction.LoadActivityBreakdown](context: ActionAugments): Promise<void>
    [PerformanceAction.LoadActivityHistories](context: ActionAugments): Promise<void>;
    [PerformanceAction.LoadEstimationBreakdown](context: ActionAugments): Promise<void>;
    [PerformanceAction.LoadDueDateBreakdown](context: ActionAugments): Promise<void>;
    [PerformanceAction.GetPerformanceRating](context: ActionAugments): Promise<PerformanceRating | null>;
}

export const setActionServices = (performanceHttp: PerformanceHttpService): void => {
    performanceHttpService = performanceHttp;
}

export const actions: ActionTree<IPerformanceState, IPerformanceState> & IPerformanceActions = {
    async [PerformanceAction.LoadCurrentDayProgression](context: ActionAugments): Promise<void> {
        const now = new Date();
        const [year, month, day] = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
        const progression = await performanceHttpService.getDailyProgression(year, month, day);
        context.commit(PerformanceMutation.SetCurrentDayProgression, progression);
    },
    async [PerformanceAction.LoadCurrentDayTimeTracking](context: ActionAugments): Promise<void> {
        const now = new Date();
        const [year, month, day] = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
        const tracking = await performanceHttpService.getDailyTimeTracking(year, month, day);
        context.commit(PerformanceMutation.SetCurrentDayTimeTracking, tracking);
    },
    async [PerformanceAction.LoadActivityBreakdown](context: ActionAugments): Promise<void> {
        const { start, end } = context.state.dateRange;
        const breakdown = await performanceHttpService.getActivityBreakdownByDateRange(start, end);
        context.commit(PerformanceMutation.SetActivityBreakdown, breakdown);
    },
    async [PerformanceAction.LoadActivityHistories](context: ActionAugments): Promise<void> {
        const { start, end } = context.state.dateRange;
        const histories = await performanceHttpService.getActivityBreakdownByDays(start, end);
        context.commit(PerformanceMutation.SetActivityHistories, histories);
    },
    async [PerformanceAction.LoadEstimationBreakdown](context: ActionAugments): Promise<void> {
        const { start, end } = context.state.dateRange;
        const breakdown = await performanceHttpService.getEstimationBreakdown(start, end);
        context.commit(PerformanceMutation.SetEstimationBreakdown, breakdown);
    },
    async [PerformanceAction.LoadDueDateBreakdown](context: ActionAugments): Promise<void> {
        const { end } = context.state.dateRange;
        const breakdown = await performanceHttpService.getDueDateBreakdown(undefined, end);
        context.commit(PerformanceMutation.SetDueDateBreakdown, breakdown);
    },
    async [PerformanceAction.GetPerformanceRating](context: ActionAugments): Promise<PerformanceRating | null> {
        const { start, end } = context.state.dateRange;

        return await performanceHttpService.getPerformanceRating(start, end);
    }
};
