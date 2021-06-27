import { shallowMount, VueWrapper } from '@vue/test-utils';

import ContentViewSeparator from './content-view-separator.vue';

describe('content view separator unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(ContentViewSeparator);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });
});
