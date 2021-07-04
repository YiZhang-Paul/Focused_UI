import { createStore } from 'vuex';

import { user, userKey } from './user/user.state';
import { performance, performanceKey } from './performance/performance.state';
import { timeSession, timeSessionKey } from './time-session/time-session.state';
import { workItem, workItemKey } from './work-item/work-item.state';

export default createStore({
    modules: {
        [userKey]: user,
        [performanceKey]: performance,
        [timeSessionKey]: timeSession,
        [workItemKey]: workItem
    }
});
