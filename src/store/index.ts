import { createStore as createBaseStore, Store } from 'vuex';

import { createModule as createUserModule, createHandlers as createUserHandlers } from './user/user.store';
import { createModule as createPerformanceModule, createHandlers as createPerformanceHandlers } from './performance/performance.store';
import { createModule as createTimeSessionModule, createHandlers as createTimeSessionHandlers } from './time-session/time-session.store';
import { createModule as createWorkItemModule, createHandlers as createWorkItemHandlers } from './work-item/work-item.store';

let store: Store<any>;
const getStore = () => store;
const userKey = 'user';
const performanceKey = 'performance';
const timeSessionKey = 'timeSession';
const workItemKey = 'workItem';

export const createStore = () => {
    store = createBaseStore({
        modules: {
            [userKey]: createUserModule(),
            [performanceKey]: createPerformanceModule(),
            [timeSessionKey]: createTimeSessionModule(),
            [workItemKey]: createWorkItemModule()
        }
    });

    return {
        store,
        [userKey]: createUserHandlers(userKey, getStore),
        [performanceKey]: createPerformanceHandlers(performanceKey, getStore),
        [timeSessionKey]: createTimeSessionHandlers(timeSessionKey, getStore),
        [workItemKey]: createWorkItemHandlers(workItemKey, getStore)
    };
}

export default createStore();
