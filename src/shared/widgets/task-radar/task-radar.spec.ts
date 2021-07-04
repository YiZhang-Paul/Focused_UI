import { shallowMount, VueWrapper } from '@vue/test-utils';

import { RadarSeries } from '../../../core/models/generic/radar-series';

import TaskRadar from './task-radar.vue';

describe('task radar unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(TaskRadar);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('series', () => {
        test('should show scan wave on series change', async() => {
            jest.useFakeTimers();
            expect(component.vm.showScanWave).toBeFalsy();

            await component.setProps({ series: [] });
            expect(component.vm.showScanWave).toBeTruthy();

            jest.advanceTimersByTime(1500);
            expect(component.vm.showScanWave).toBeFalsy();
            jest.useRealTimers();
        });
    });

    describe('getPointWrapperStyle', () => {
        const minDegree = 18;
        const maxDegree = 72;

        test('should return correct style for urgent important items', () => {
            for (let i = 0; i < 100; ++i) {
                const point: RadarSeries = { ...new RadarSeries(), quadrant: 1 };
                const style = component.vm.getPointWrapperStyle(point);
                const transform = Number(style.transform.replace(/rotate\(|deg\)/g, ''));

                expect(transform).toBeGreaterThanOrEqual(minDegree);
                expect(transform).toBeLessThanOrEqual(maxDegree);
            }
        });

        test('should return correct style for important not urgent items', () => {
            for (let i = 0; i < 100; ++i) {
                const point: RadarSeries = { ...new RadarSeries(), quadrant: 2 };
                const style = component.vm.getPointWrapperStyle(point);
                const transform = Number(style.transform.replace(/rotate\(|deg\)/g, ''));

                expect(transform).toBeGreaterThanOrEqual(minDegree - 90);
                expect(transform).toBeLessThanOrEqual(maxDegree - 90);
            }
        });

        test('should return correct style for urgent not important items', () => {
            for (let i = 0; i < 100; ++i) {
                const point: RadarSeries = { ...new RadarSeries(), quadrant: 3 };
                const style = component.vm.getPointWrapperStyle(point);
                const transform = Number(style.transform.replace(/rotate\(|deg\)/g, ''));

                expect(transform).toBeGreaterThanOrEqual(minDegree - 90 * 2);
                expect(transform).toBeLessThanOrEqual(maxDegree - 90 * 2);
            }
        });

        test('should return correct style for not urgent not important items', () => {
            for (let i = 0; i < 100; ++i) {
                const point: RadarSeries = { ...new RadarSeries(), quadrant: 4 };
                const style = component.vm.getPointWrapperStyle(point);
                const transform = Number(style.transform.replace(/rotate\(|deg\)/g, ''));

                expect(transform).toBeGreaterThanOrEqual(minDegree - 90 * 3);
                expect(transform).toBeLessThanOrEqual(maxDegree - 90 * 3);
            }
        });
    });

    describe('getPointStyle', () => {
        test('should return correct style for items', () => {
            const point: RadarSeries = { ...new RadarSeries(), value: 0.5 };
            expect(component.vm.getPointStyle(point).top).toEqual('80%');
            expect(component.vm.getPointStyle(point).width.startsWith('0.58')).toBeTruthy();
            expect(component.vm.getPointStyle(point).height.startsWith('0.58')).toBeTruthy();

            point.value = 10;
            expect(component.vm.getPointStyle(point).top).toEqual('20%');
            expect(component.vm.getPointStyle(point).width.startsWith('0.82')).toBeTruthy();
            expect(component.vm.getPointStyle(point).height.startsWith('0.82')).toBeTruthy();
        });
    });
});
