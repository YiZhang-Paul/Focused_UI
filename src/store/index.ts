import { createStore as createBaseStore } from 'vuex';

import { createStore as createUserStore } from './user/user.store';
import { createStore as createPerformanceStore } from './performance/performance.store';
import { createStore as createTimeSessionStore } from './time-session/time-session.store';
import { createStore as createWorkItemStore } from './work-item/work-item.store';

export const createStore = () => {
    const userNamespace = 'user';
    const performanceNamespace = 'performance';
    const timeSessionNamespace = 'timeSession';
    const workItemNamespace = 'workItem';
    const userStore = createUserStore(userNamespace);
    const performanceStore = createPerformanceStore(performanceNamespace);
    const timeSessionStore = createTimeSessionStore(timeSessionNamespace);
    const workItemStore = createWorkItemStore(workItemNamespace);

    return {
        [userNamespace]: userStore.utilities,
        [performanceNamespace]: performanceStore.utilities,
        [timeSessionNamespace]: timeSessionStore.utilities,
        [workItemNamespace]: workItemStore.utilities,
        store: createBaseStore({
            modules: {
                [userNamespace]: userStore.module,
                [performanceNamespace]: performanceStore.module,
                [timeSessionNamespace]: timeSessionStore.module,
                [workItemNamespace]: workItemStore.module
            }
        })
    };
};

export default createStore();
