import { shallowMount, VueWrapper } from '@vue/test-utils';

import App from './app.vue';

describe('app unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(App);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });
});
