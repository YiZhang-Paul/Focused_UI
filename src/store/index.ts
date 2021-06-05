import { createStore } from 'vuex';

import { workItem, workItemKey } from './work-item/work-item.state';

export default createStore({
    modules: {
        [workItemKey]: workItem
    }
});
