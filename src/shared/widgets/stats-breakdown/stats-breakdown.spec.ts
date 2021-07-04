import { shallowMount, VueWrapper } from '@vue/test-utils';

import StatsBreakdown from './stats-breakdown.vue';

describe('stats breakdown unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(StatsBreakdown);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });
});
