import { ActionContext } from 'vuex';

import { WorkItemDto } from '../../core/dtos/work-item-dto';
import { WorkItemHttpService } from '../../core/services/http/work-item-http/work-item-http.service';

const workItemHttpService = new WorkItemHttpService();

export interface IWorkItemState {
    workItems: WorkItemDto[];
}

const state = (): IWorkItemState => ({
    workItems: []
});

const getters = {
    workItems: (state: IWorkItemState): WorkItemDto[] => state.workItems
};

const mutations = {
    setWorkItems(state: IWorkItemState, items: WorkItemDto[]): void {
        state.workItems = items.slice();
    }
};

const actions = {
    async loadWorkItems(context: ActionContext<IWorkItemState, any>): Promise<void> {
        context.commit('setWorkItems', await workItemHttpService.getWorkItems());
    }
};

export const workItemKey = 'workItem';

export const workItem = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
