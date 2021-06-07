import { createStore } from 'vuex';

import { performance, performanceKey } from './performance/performance.state';
import { workItem, workItemKey } from './work-item/work-item.state';

export default createStore({
    modules: {
        [performanceKey]: performance,
        [workItemKey]: workItem
    }
});
