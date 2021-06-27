import { shallowMount, VueWrapper } from '@vue/test-utils';

import ToggleButton from './toggle-button.vue';

describe('toggle button unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(ToggleButton);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });
});
