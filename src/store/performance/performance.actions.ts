import { ActionContext, ActionTree } from 'vuex';

import { PerformanceRating } from '../../core/models/user/performance-rating';
import { PerformanceHttpService } from '../../core/services/http/performance-http/performance-http.service';

import { IState } from './performance.state';
import { IMutations, MutationKey } from './performance.mutations';

let performanceHttpService: PerformanceHttpService;

export enum ActionKey {
    LoadCurrentDayProgression = 'load_current_day_progression',
    LoadCurrentDayTimeTracking = 'load_current_day_time_tracking',
    LoadActivityBreakdown = 'load_activity_breakdown',
    LoadActivityHistories = 'load_activity_histories',
    LoadEstimationBreakdown = 'load_estimation_breakdown',
    LoadDueDateBreakdown = 'load_due_date_breakdown',
    GetPerformanceRating = 'get_performance_rating'
}

interface ActionAugments extends Omit<ActionContext<IState, IState>, 'commit'> {
    commit<T extends keyof IMutations>(key: T, payload: Parameters<IMutations[T]>[1]): ReturnType<IMutations[T]>;
}

export interface IActions {
    [ActionKey.LoadCurrentDayProgression](context: ActionAugments): Promise<void>;
    [ActionKey.LoadCurrentDayTimeTracking](context: ActionAugments): Promise<void>;
    [ActionKey.LoadActivityBreakdown](context: ActionAugments): Promise<void>
    [ActionKey.LoadActivityHistories](context: ActionAugments): Promise<void>;
    [ActionKey.LoadEstimationBreakdown](context: ActionAugments): Promise<void>;
    [ActionKey.LoadDueDateBreakdown](context: ActionAugments): Promise<void>;
    [ActionKey.GetPerformanceRating](context: ActionAugments): Promise<PerformanceRating | null>;
}

export const setActionServices = (performanceHttp: PerformanceHttpService): void => {
    performanceHttpService = performanceHttp;
}

export const actions: ActionTree<IState, IState> & IActions = {
    async [ActionKey.LoadCurrentDayProgression](context: ActionAugments): Promise<void> {
        const now = new Date();
        const [year, month, day] = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
        const progression = await performanceHttpService.getDailyProgression(year, month, day);
        context.commit(MutationKey.SetCurrentDayProgression, progression);
    },
    async [ActionKey.LoadCurrentDayTimeTracking](context: ActionAugments): Promise<void> {
        const now = new Date();
        const [year, month, day] = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
        const tracking = await performanceHttpService.getDailyTimeTracking(year, month, day);
        context.commit(MutationKey.SetCurrentDayTimeTracking, tracking);
    },
    async [ActionKey.LoadActivityBreakdown](context: ActionAugments): Promise<void> {
        const { start, end } = context.state.dateRange;
        const breakdown = await performanceHttpService.getActivityBreakdownByDateRange(start, end);
        context.commit(MutationKey.SetActivityBreakdown, breakdown);
    },
    async [ActionKey.LoadActivityHistories](context: ActionAugments): Promise<void> {
        const { start, end } = context.state.dateRange;
        const histories = await performanceHttpService.getActivityBreakdownByDays(start, end);
        context.commit(MutationKey.SetActivityHistories, histories);
    },
    async [ActionKey.LoadEstimationBreakdown](context: ActionAugments): Promise<void> {
        const { start, end } = context.state.dateRange;
        const breakdown = await performanceHttpService.getEstimationBreakdown(start, end);
        context.commit(MutationKey.SetEstimationBreakdown, breakdown);
    },
    async [ActionKey.LoadDueDateBreakdown](context: ActionAugments): Promise<void> {
        const { end } = context.state.dateRange;
        const breakdown = await performanceHttpService.getDueDateBreakdown(undefined, end);
        context.commit(MutationKey.SetDueDateBreakdown, breakdown);
    },
    async [ActionKey.GetPerformanceRating](context: ActionAugments): Promise<PerformanceRating | null> {
        const { start, end } = context.state.dateRange;

        return await performanceHttpService.getPerformanceRating(start, end);
    }
};
