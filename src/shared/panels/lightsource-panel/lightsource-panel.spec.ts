import { shallowMount, VueWrapper } from '@vue/test-utils';

import LightsourcePanel from './lightsource-panel.vue';

describe('lightsource panel unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(LightsourcePanel);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });
});
