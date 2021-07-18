import { createStore as createBaseStore } from 'vuex';

import { createStore as createUserStore } from './user/user.store';
import { createStore as createPerformanceStore } from './performance/performance.store';
import { createStore as createTimeSessionStore } from './time-session/time-session.store';
import { createStore as createWorkItemStore } from './work-item/work-item.store';

const userKey = 'user';
const performanceKey = 'performance';
const timeSessionKey = 'timeSession';
const workItemKey = 'workItem';

export const createStore = () => {
    const user = createUserStore(userKey);
    const performance = createPerformanceStore(performanceKey);
    const timeSession = createTimeSessionStore(timeSessionKey);
    const workItem = createWorkItemStore(workItemKey);

    return {
        [userKey]: user.handlers,
        [performanceKey]: performance.handlers,
        [timeSessionKey]: timeSession.handlers,
        [workItemKey]: workItem.handlers,
        store: createBaseStore({
            modules: {
                [userKey]: user.module,
                [performanceKey]: performance.module,
                [timeSessionKey]: timeSession.module,
                [workItemKey]: workItem.module
            }
        })
    };
};

export default createStore();
