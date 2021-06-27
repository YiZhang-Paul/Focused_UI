import { shallowMount, VueWrapper } from '@vue/test-utils';

import { ProgressionCounter } from '../../../core/models/generic/progression-counter';
import { PercentageSeries } from '../../../core/models/progress-bar/percentage-series';

import ItemCompletionProgress from './item-completion-progress.vue';

describe('item completion progress unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(ItemCompletionProgress);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('isOverestimate', () => {
        test('should return true when overestimation exceeds 3 hours', async() => {
            const progress: ProgressionCounter<number> = { current: 1.5, target: 5, isCompleted: true };
            await component.setProps({ progress });

            expect(component.vm.isOverestimate).toBeTruthy();
        });

        test('should return true when overestimation reaches 60 percent and base estimation is greater than 30 minutes', async() => {
            const progress: ProgressionCounter<number> = { current: 0.4, target: 1, isCompleted: true };
            await component.setProps({ progress });

            expect(component.vm.isOverestimate).toBeTruthy();
        });

        test('should return false when overestimation is less than 3 hours and does not exceed 60 percent', async() => {
            const progress: ProgressionCounter<number> = { current: 5, target: 6, isCompleted: true };
            await component.setProps({ progress });

            expect(component.vm.isOverestimate).toBeFalsy();
        });

        test('should return false when overestimation exceeds 60 percent but base estimation is not greater than 30 minutes', async() => {
            const progress: ProgressionCounter<number> = { current: 0.2, target: 0.5, isCompleted: true };
            await component.setProps({ progress });

            expect(component.vm.isOverestimate).toBeFalsy();
        });

        test('should return false when no overestimation occurred', async() => {
            const progress: ProgressionCounter<number> = { current: 0.5, target: 0.5, isCompleted: true };
            await component.setProps({ progress });

            expect(component.vm.isOverestimate).toBeFalsy();
        });
    });

    describe('series', () => {
        test('should return empty collection when target is not defined', async() => {
            const progress: ProgressionCounter<number> = { current: 0.5, target: 0, isCompleted: false };
            await component.setProps({ progress });

            expect(component.vm.series).toEqual([]);
        });

        test('should return correct percentages for underestimated items', async() => {
            const expected: PercentageSeries[] = [
                { percent: 40, colorType: 'progress-colors-normal' },
                { percent: 60, colorType: 'progress-colors-underestimate' }
            ];

            const progress: ProgressionCounter<number> = { current: 5, target: 2, isCompleted: false };
            await component.setProps({ progress });

            expect(component.vm.series).toEqual(expected);
        });

        test('should return correct percentages for overestimated items', async() => {
            const expected: PercentageSeries[] = [
                { percent: 40, colorType: 'progress-colors-normal' },
                { percent: 60, colorType: 'progress-colors-overestimate' }
            ];

            const progress: ProgressionCounter<number> = { current: 2, target: 5, isCompleted: true };
            await component.setProps({ progress });

            expect(component.vm.series).toEqual(expected);
        });

        test('should return correct percentages for faster items', async() => {
            const expected: PercentageSeries[] = [
                { percent: 40, colorType: 'progress-colors-normal' },
                { percent: 60, colorType: 'progress-colors-faster' }
            ];

            const progress: ProgressionCounter<number> = { current: 0.2, target: 0.5, isCompleted: true };
            await component.setProps({ progress });

            expect(component.vm.series).toEqual(expected);
        });

        test('should return correct percentages for unfinished items', async() => {
            const expected: PercentageSeries[] = [
                { percent: 40, colorType: 'progress-colors-normal' },
                { percent: 0, colorType: 'progress-colors-overestimate' }
            ];

            const progress: ProgressionCounter<number> = { current: 2, target: 5, isCompleted: false };
            await component.setProps({ progress });

            expect(component.vm.series).toEqual(expected);
        });
    });
});
