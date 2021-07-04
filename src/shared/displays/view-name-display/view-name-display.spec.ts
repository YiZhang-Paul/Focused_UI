import { shallowMount, VueWrapper } from '@vue/test-utils';

import ViewNameDisplay from './view-name-display.vue';

describe('view name display unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(ViewNameDisplay);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });
});
