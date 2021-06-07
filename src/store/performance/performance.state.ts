import { ActionContext } from 'vuex';

import { ActivityBreakdownDto } from '../../core/dtos/activity-breakdown-dto';
import { ProgressionCounter } from '../../core/models/generic/progression-counter';
import { PerformanceHttpService } from '../../core/services/http/performance-http/performance-http.service';

const performanceHttpService = new PerformanceHttpService();

export interface IPerformanceState {
    currentDayProgression: ProgressionCounter<number> | null;
    activityBreakdown: ActivityBreakdownDto | null;
}

const state = (): IPerformanceState => ({
    currentDayProgression: null,
    activityBreakdown: null
});

const getters = {
    currentDayProgression: (state: IPerformanceState): ProgressionCounter<number> | null => state.currentDayProgression,
    activityBreakdown: (state: IPerformanceState): ActivityBreakdownDto | null => state.activityBreakdown
};

const mutations = {
    setCurrentDayProgression(state: IPerformanceState, progression: ProgressionCounter<number> | null): void {
        state.currentDayProgression = progression;
    },
    setActivityBreakdown(state: IPerformanceState, breakdown: ActivityBreakdownDto | null): void {
        state.activityBreakdown = breakdown;
    }
};

const actions = {
    async loadCurrentDayProgression(context: ActionContext<IPerformanceState, any>): Promise<void> {
        const progression = await performanceHttpService.getDailyProgression(...getCurrentDate());
        context.commit('setCurrentDayProgression', progression);
    },
    async loadActivityBreakdown(context: ActionContext<IPerformanceState, any>): Promise<void> {
        const breakdown = await performanceHttpService.getDailyActivityBreakdown(...getCurrentDate());
        context.commit('setActivityBreakdown', breakdown);
    }
};

function getCurrentDate(): [number, number, number] {
    const now = new Date();

    return [now.getFullYear(), now.getMonth() + 1, now.getDate()];
}

export const performanceKey = 'performance';

export const performance = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
