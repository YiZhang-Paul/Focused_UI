import { createStore } from 'vuex';

import { user, userKey } from './user/user.state';
import { performance, performanceKey } from './performance/performance.state';
import { workItem, workItemKey } from './work-item/work-item.state';

export default createStore({
    modules: {
        [userKey]: user,
        [performanceKey]: performance,
        [workItemKey]: workItem
    }
});
