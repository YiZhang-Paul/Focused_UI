import { shallowMount, VueWrapper } from '@vue/test-utils';

import { createStore } from './store';
import App from './app.vue';

describe('app unit test', () => {
    let component: VueWrapper<any>;
    let store: ReturnType<typeof createStore>;

    beforeEach(() => {
        store = createStore();
        component = shallowMount(App, { global: { mocks: { $store: store.store } } });
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });
});
