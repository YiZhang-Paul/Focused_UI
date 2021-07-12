import { shallowMount, VueWrapper } from '@vue/test-utils';

import BreakSessionStopDialog from './break-session-stop-dialog.vue';

describe('break session stop dialog unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(BreakSessionStopDialog);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });
});
