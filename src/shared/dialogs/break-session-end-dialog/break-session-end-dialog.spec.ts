import { shallowMount, VueWrapper } from '@vue/test-utils';

import BreakSessionEndDialog from './break-session-end-dialog.vue';

describe('break session end dialog unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(BreakSessionEndDialog);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });
});
