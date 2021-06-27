import { shallowMount, VueWrapper } from '@vue/test-utils';
import { createStore, Store } from 'vuex';

import { createStore as createUserStore, userKey } from './store/user/user.state';
import { createStore as createTimeSessionStore, timeSessionKey } from './store/time-session/time-session.state';
import { createStore as createPerformanceStore, performanceKey } from './store/performance/performance.state';
import App from './app.vue';

describe('app unit test', () => {
    let component: VueWrapper<any>;
    let store: Store<any>;

    beforeEach(() => {
        store = createStore({
            modules: {
                [userKey]: createUserStore(),
                [timeSessionKey]: createTimeSessionStore(),
                [performanceKey]: createPerformanceStore()
            }
        });

        component = shallowMount(App, { global: { mocks: { $store: store } } });
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });
});
