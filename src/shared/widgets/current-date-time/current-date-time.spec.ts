import { shallowMount, VueWrapper } from '@vue/test-utils';

import CurrentDateTime from './current-date-time.vue';

describe('current date time unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(CurrentDateTime);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });
});