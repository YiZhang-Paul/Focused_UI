import { ActionContext } from 'vuex';

import { ActivityBreakdownDto } from '../../core/dtos/activity-breakdown-dto';
import { EstimationBreakdownDto } from '../../core/dtos/estimation-breakdown-dto';
import { DateRange } from '../../core/models/generic/date-range';
import { ProgressionCounter } from '../../core/models/generic/progression-counter';
import { PerformanceHttpService } from '../../core/services/http/performance-http/performance-http.service';

const oneDay = 24 * 60 * 60 * 1000;
const performanceHttpService = new PerformanceHttpService();

export interface IPerformanceState {
    dateRange: DateRange;
    currentDayProgression: ProgressionCounter<number> | null;
    activityBreakdown: ActivityBreakdownDto | null;
    activityHistories: ActivityBreakdownDto[];
    estimationBreakdown: EstimationBreakdownDto | null;
}

const state = (): IPerformanceState => ({
    dateRange: { start: new Date(Date.now() - 14 * oneDay), end: new Date() },
    currentDayProgression: null,
    activityBreakdown: null,
    activityHistories: [],
    estimationBreakdown: null
});

const getters = {
    dateRange: (state: IPerformanceState): DateRange => state.dateRange,
    currentDayProgression: (state: IPerformanceState): ProgressionCounter<number> | null => state.currentDayProgression,
    activityBreakdown: (state: IPerformanceState): ActivityBreakdownDto | null => state.activityBreakdown,
    activityHistories: (state: IPerformanceState): ActivityBreakdownDto[] => state.activityHistories,
    estimationBreakdown: (state: IPerformanceState): EstimationBreakdownDto | null => state.estimationBreakdown
};

const mutations = {
    setCurrentDayProgression(state: IPerformanceState, progression: ProgressionCounter<number> | null): void {
        state.currentDayProgression = progression;
    },
    setActivityBreakdown(state: IPerformanceState, breakdown: ActivityBreakdownDto | null): void {
        state.activityBreakdown = breakdown;
    },
    setActivityHistories(state: IPerformanceState, histories: ActivityBreakdownDto[]): void {
        state.activityHistories = histories;
    },
    setEstimationBreakdown(state: IPerformanceState, breakdown: EstimationBreakdownDto | null): void {
        state.estimationBreakdown = breakdown;
    }
};

const actions = {
    async loadCurrentDayProgression(context: ActionContext<IPerformanceState, any>): Promise<void> {
        const now = new Date();
        const [year, month, day] = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
        const progression = await performanceHttpService.getDailyProgression(year, month, day);
        context.commit('setCurrentDayProgression', progression);
    },
    async loadActivityBreakdown(context: ActionContext<IPerformanceState, any>): Promise<void> {
        const { start, end } = context.state.dateRange;
        const breakdown = await performanceHttpService.getActivityBreakdownByDateRange(start, end);
        context.commit('setActivityBreakdown', breakdown);
    },
    async loadActivityHistories(context: ActionContext<IPerformanceState, any>): Promise<void> {
        const { start, end } = context.state.dateRange;
        const histories = await performanceHttpService.getActivityBreakdownByDays(start, end);
        context.commit('setActivityHistories', histories);
    },
    async loadEstimationBreakdown(context: ActionContext<IPerformanceState, any>): Promise<void> {
        const { start, end } = context.state.dateRange;
        const breakdown = await performanceHttpService.getEstimationBreakdown(start, end);
        context.commit('setEstimationBreakdown', breakdown);
    }
};

export const performanceKey = 'performance';

export const performance = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
