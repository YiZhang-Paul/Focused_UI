import { shallowMount, VueWrapper } from '@vue/test-utils';

import CreationButton from './creation-button.vue';

describe('creation button unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(CreationButton);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });
});
