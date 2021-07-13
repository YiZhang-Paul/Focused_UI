import { shallowMount, VueWrapper } from '@vue/test-utils';
import { Point } from 'electron';

import { PerformanceRating } from '../../../core/models/user/performance-rating';

import UserRatingsTracker from './user-ratings-tracker.vue';

describe('user ratings tracker unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(UserRatingsTracker);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('gridLinePaths', () => {
        test('should return grid line paths', () => {
            const expected = [
                'M50 50 L50 4.5',
                'M50 50 L97.5 39',
                'M50 50 L77.5 94.5',
                'M50 50 L22.5 94.5',
                'M50 50 L2.5 39',
            ];

            expect(component.vm.gridLinePaths).toEqual(expected);
        });
    });

    describe('ratingsPath', () => {
        test('should return correct path', async() => {
            let ratings = new PerformanceRating();
            await component.setProps({ ratings });
            expect(component.vm.ratingsPath).toEqual('M50 50L50 50L50 50L50 50L50 50Z');

            ratings = { determination: 1, planning: 1, sustainability: 1, adaptability: 1, estimation: 1 };
            await component.setProps({ ratings });
            expect(component.vm.ratingsPath).toEqual('M50 4.5L97.5 39L77.5 94.5L22.5 94.5L2.5 39Z');

            ratings = { determination: 0.5, planning: 0.5, sustainability: 0.5, adaptability: 0.5, estimation: 0.5 };
            await component.setProps({ ratings });
            expect(component.vm.ratingsPath).toEqual('M50 27.25L73.75 44.5L63.75 72.25L36.25 72.25L26.25 44.5Z');
        });
    });

    describe('getClosedPath', () => {
        test('should return grid line paths', () => {
            const points: Point[] = [
                { x: 50, y: 4.5 },
                { x: 77.5, y: 94.5 },
                { x: 2.5, y: 39 }
            ];

            expect(component.vm.getClosedPath(points)).toEqual('M50 4.5L77.5 94.5L2.5 39Z');
        });
    });
});
