import { shallowMount, VueWrapper } from '@vue/test-utils';

import ContentViewPanel from './content-view-panel.vue';

describe('content view panel unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(ContentViewPanel);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });
});
