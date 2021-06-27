import { shallowMount, VueWrapper } from '@vue/test-utils';

import { PercentageSeries } from '../../../core/models/progress-bar/percentage-series';
import { BlockGroup } from '../../../core/models/progress-bar/block-group';

import ProgressBar from './progress-bar.vue';

describe('progress bar unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(ProgressBar);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('blockGroups', () => {
        test('should return correct block counts when progress bar is not full', async() => {
            const series: PercentageSeries[] = [
                { percent: 10, colorType: 'type' },
                { percent: 20, colorType: 'type' }
            ];

            const expected: BlockGroup[] = [
                { total: 3, backgroundColor: 'var(--type-00)', shadowColor: 'var(--type-04)' },
                { total: 5, backgroundColor: 'var(--type-00)', shadowColor: 'var(--type-04)' }
            ];

            await component.setProps({ series });

            expect(component.vm.blockGroups).toEqual(expected);
            expect(component.vm.placeholders).toEqual(19);
        });

        test('should return correct block counts when progress bar is full', async() => {
            const series: PercentageSeries[] = [
                { percent: 10, colorType: 'type' },
                { percent: 20, colorType: 'type' },
                { percent: 70, colorType: 'type' }
            ];

            const expected: BlockGroup[] = [
                { total: 3, backgroundColor: 'var(--type-00)', shadowColor: 'var(--type-04)' },
                { total: 5, backgroundColor: 'var(--type-00)', shadowColor: 'var(--type-04)' },
                { total: 19, backgroundColor: 'var(--type-00)', shadowColor: 'var(--type-04)' }
            ];

            await component.setProps({ series });

            expect(component.vm.blockGroups).toEqual(expected);
            expect(component.vm.placeholders).toEqual(0);
        });

        test('should exclude invalid percentage series', async() => {
            const series: PercentageSeries[] = [
                { percent: 10, colorType: 'type' },
                { percent: 0, colorType: 'type' },
                { percent: 20, colorType: 'type' },
                { percent: 0, colorType: 'type' }
            ];

            const expected: BlockGroup[] = [
                { total: 3, backgroundColor: 'var(--type-00)', shadowColor: 'var(--type-04)' },
                { total: 5, backgroundColor: 'var(--type-00)', shadowColor: 'var(--type-04)' }
            ];

            await component.setProps({ series });

            expect(component.vm.blockGroups).toEqual(expected);
            expect(component.vm.placeholders).toEqual(19);
        });

        test('should handle input overflow', async() => {
            const series: PercentageSeries[] = [
                { percent: 40, colorType: 'type' },
                { percent: 60, colorType: 'type' },
                { percent: 75, colorType: 'type' }
            ];

            const expected: BlockGroup[] = [
                { total: 6, backgroundColor: 'var(--type-00)', shadowColor: 'var(--type-04)' },
                { total: 9, backgroundColor: 'var(--type-00)', shadowColor: 'var(--type-04)' },
                { total: 12, backgroundColor: 'var(--type-00)', shadowColor: 'var(--type-04)' }
            ];

            await component.setProps({ series });

            expect(component.vm.blockGroups).toEqual(expected);
            expect(component.vm.placeholders).toEqual(0);
        });
    });

    describe('getGroupStyle', () => {
        test('should return correct style', () => {
            const group: BlockGroup = { total: 5, backgroundColor: 'red', shadowColor: 'red' };

            expect(component.vm.getGroupStyle(group)['background-color']).toEqual('red');
            expect(component.vm.getGroupStyle(group)['box-shadow']).toEqual('0 0 4px red');
        });
    });
});
