import { ActionContext } from 'vuex';

import { ActivityBreakdownDto } from '../../core/dtos/activity-breakdown-dto';
import { EstimationBreakdownDto } from '../../core/dtos/estimation-breakdown-dto';
import { ProgressionCounter } from '../../core/models/generic/progression-counter';
import { PerformanceHttpService } from '../../core/services/http/performance-http/performance-http.service';

const performanceHttpService = new PerformanceHttpService();

export interface IPerformanceState {
    currentDayProgression: ProgressionCounter<number> | null;
    activityBreakdown: ActivityBreakdownDto | null;
    estimationBreakdown: EstimationBreakdownDto | null;
}

const state = (): IPerformanceState => ({
    currentDayProgression: null,
    activityBreakdown: null,
    estimationBreakdown: null
});

const getters = {
    currentDayProgression: (state: IPerformanceState): ProgressionCounter<number> | null => state.currentDayProgression,
    activityBreakdown: (state: IPerformanceState): ActivityBreakdownDto | null => state.activityBreakdown,
    estimationBreakdown: (state: IPerformanceState): EstimationBreakdownDto | null => state.estimationBreakdown
};

const mutations = {
    setCurrentDayProgression(state: IPerformanceState, progression: ProgressionCounter<number> | null): void {
        state.currentDayProgression = progression;
    },
    setActivityBreakdown(state: IPerformanceState, breakdown: ActivityBreakdownDto | null): void {
        state.activityBreakdown = breakdown;
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
        const breakdown = await performanceHttpService.getActivityBreakdown();
        context.commit('setActivityBreakdown', breakdown);
    },
    async loadEstimationBreakdown(context: ActionContext<IPerformanceState, any>): Promise<void> {
        const breakdown = await performanceHttpService.getEstimationBreakdown();
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
