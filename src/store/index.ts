import { createStore } from 'vuex';

import { user, userKey } from './user/user.store';
import { performance, performanceKey } from './performance/performance.store';
import { timeSession, timeSessionKey } from './time-session/time-session.store';
import { workItem, workItemKey } from './work-item/work-item.store';

export default createStore({
    modules: {
        [userKey]: user,
        [performanceKey]: performance,
        [timeSessionKey]: timeSession,
        [workItemKey]: workItem
    }
});
