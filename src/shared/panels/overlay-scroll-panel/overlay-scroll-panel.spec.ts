import { shallowMount, VueWrapper } from '@vue/test-utils';

import OverlayScrollPanel from './overlay-scroll-panel.vue';

describe('overlay scroll panel unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(OverlayScrollPanel);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });
});
