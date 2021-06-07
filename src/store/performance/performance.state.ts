import { ActionContext } from 'vuex';

import { ProgressionCounter } from '../../core/models/generic/progression-counter';
import { PerformanceHttpService } from '../../core/services/http/performance-http/performance-http.service';

const performanceHttpService = new PerformanceHttpService();

export interface IPerformanceState {
    currentDayProgression: ProgressionCounter<number> | null;
}

const state = (): IPerformanceState => ({
    currentDayProgression: null
});

const getters = {
    currentDayProgression: (state: IPerformanceState): ProgressionCounter<number> | null => state.currentDayProgression
};

const mutations = {
    setCurrentDayProgression(state: IPerformanceState, progression: ProgressionCounter<number> | null): void {
        state.currentDayProgression = progression;
    }
};

const actions = {
    async loadCurrentDayProgression(context: ActionContext<IPerformanceState, any>): Promise<void> {
        const now = new Date();
        const [year, month, day] = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
        context.commit('setCurrentDayProgression', await performanceHttpService.getDailyProgression(year, month, day));
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
