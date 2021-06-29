import { shallowMount, VueWrapper } from '@vue/test-utils';

import { TimeTrackingBreakdownDto } from '../../../core/dtos/time-tracking-breakdown-dto';

import TimeTrackingBreakdown from './time-tracking-breakdown.vue';

describe('time tracking breakdown unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(TimeTrackingBreakdown);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('hoursValue', () => {
        test('should return empty string when no active option available', () => {
            component.vm.index = -1;

            expect(component.vm.hoursValue).toEqual('');
        });

        test('should return correct value for active option', async() => {
            const tracking: TimeTrackingBreakdownDto = { activityTime: 1, breakTime: 3.2, untrackedTime: 2 };
            await component.setProps({ tracking });
            component.vm.index = 1;

            expect(component.vm.hoursValue).toEqual('3.2h');
        });
    });

    describe('activityStyle', () => {
        test('should return correct rotation', async() => {
            const tracking: TimeTrackingBreakdownDto = { activityTime: 24, breakTime: 0, untrackedTime: 0 };
            await component.setProps({ tracking });
            component.vm.index = 0;

            expect(component.vm.activityStyle.transform).toEqual('rotate(-450deg)');
        });
    });

    describe('breakStyle', () => {
        test('should return correct rotation', async() => {
            const tracking: TimeTrackingBreakdownDto = { activityTime: 0, breakTime: 0, untrackedTime: 0 };
            await component.setProps({ tracking });
            component.vm.index = 1;

            expect(component.vm.breakStyle.transform).toEqual('rotate(-90deg)');
        });
    });

    describe('untrackedStyle', () => {
        test('should return correct rotation', async() => {
            const tracking: TimeTrackingBreakdownDto = { activityTime: 0, breakTime: 24, untrackedTime: 0 };
            await component.setProps({ tracking });

            expect(component.vm.untrackedStyle.transform).toEqual('rotate(270deg)');
        });
    });

    describe('getColor', () => {
        test('should return correct color', async() => {
            let tracking: TimeTrackingBreakdownDto;
            expect(component.vm.getColor(-1)).toEqual('');

            tracking = { activityTime: 1, breakTime: 0, untrackedTime: 0 };
            await component.setProps({ tracking });
            expect(component.vm.getColor(0)).toEqual('rgb(255, 255, 255)');

            tracking = { activityTime: 0, breakTime: 0, untrackedTime: 0 };
            await component.setProps({ tracking });
            expect(component.vm.getColor(0)).toEqual('rgb(100, 100, 100)');

            tracking = { activityTime: 0, breakTime: 1, untrackedTime: 0 };
            await component.setProps({ tracking });
            expect(component.vm.getColor(1)).toEqual('rgb(142, 222, 174)');

            tracking = { activityTime: 0, breakTime: 0, untrackedTime: 0 };
            await component.setProps({ tracking });
            expect(component.vm.getColor(1)).toEqual('rgb(100, 100, 100)');

            expect(component.vm.getColor(2)).toEqual('rgb(100, 100, 100)');
        });
    });
});
