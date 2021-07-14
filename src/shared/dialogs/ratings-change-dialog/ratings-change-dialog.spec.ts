import { shallowMount, VueWrapper } from '@vue/test-utils';

import { ValueChange } from '../../../core/models/generic/value-change';
import { PerformanceRating } from '../../../core/models/user/performance-rating';

import RatingsChangeDialog from './ratings-change-dialog.vue';

describe('ratings change dialog unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(RatingsChangeDialog);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('changes', () => {
        test('should return correct ratings change', async() => {
            const previous: PerformanceRating = {
                determination: 0.55,
                estimation: 0.5,
                planning: 0.7,
                adaptability: 0.45,
                sustainability: 0.85
            };

            const current: PerformanceRating = {
                determination: 0.6,
                estimation: 0.35,
                planning: 0.75,
                adaptability: 0.45,
                sustainability: 0.8
            };

            const data = new ValueChange<PerformanceRating>(previous, current);
            await component.setProps({ data });

            expect(component.vm.changes[0].value).toEqual(5);
            expect(component.vm.changes[1].value).toEqual(-15);
            expect(component.vm.changes[2].value).toEqual(5);
            expect(component.vm.changes[3].value).toEqual(0);
            expect(component.vm.changes[4].value).toEqual(-5);
        });
    });
});
