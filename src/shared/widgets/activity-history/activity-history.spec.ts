import { shallowMount, VueWrapper } from '@vue/test-utils';

import { ActivityBreakdownDto } from '../../../core/dtos/activity-breakdown-dto';
import { DateRange } from '../../../core/models/generic/date-range';

import ActivityHistory from './activity-history.vue';

describe('activity history unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(ActivityHistory);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('startDate', () => {
        test('should return correct start date', async() => {
            const dateRange: DateRange = { start: new Date(2021, 1, 1), end: new Date() };
            await component.setProps({ dateRange });

            expect(component.vm.startDate).toEqual('Feb 01');
        });
    });

    describe('endDate', () => {
        test('should return correct end date', async() => {
            const dateRange: DateRange = { start: new Date(2021, 1, 1), end: new Date(2021, 1, 9) };
            await component.setProps({ dateRange });

            expect(component.vm.endDate).toEqual('Feb 08');
        });
    });

    describe('getFillerStyle', () => {
        beforeEach(async() => {
            const histories: ActivityBreakdownDto[] = [
                { regular: 3, recurring: 1, interruption: 1, overlearning: 1 },
                { regular: 2, recurring: 0, interruption: 0, overlearning: 1 },
                { regular: 7, recurring: 3, interruption: 1, overlearning: 1 }
            ];

            await component.setProps({ histories });
        });

        test('should return correct style for first entry', () => {
            expect(component.vm.getFillerStyle(0).height).toEqual('75%');
            expect(component.vm.getFillerStyle(0)['max-height']).toEqual('75%');
        });

        test('should return correct style when subsequent entry is smaller', () => {
            expect(component.vm.getFillerStyle(1).height).toEqual('75%');
            expect(component.vm.getFillerStyle(1)['max-height']).toEqual('75%');
        });

        test('should return correct style when subsequent entry is larger', () => {
            expect(component.vm.getFillerStyle(2).height).toEqual('50%');
            expect(component.vm.getFillerStyle(2)['max-height']).toEqual('50%');
        });
    });

    describe('getFocusChangeStyle', () => {
        beforeEach(async() => {
            const histories: ActivityBreakdownDto[] = [
                { regular: 3, recurring: 1, interruption: 1, overlearning: 1 },
                { regular: 2, recurring: 0, interruption: 0, overlearning: 1 },
                { regular: 7, recurring: 3, interruption: 1, overlearning: 1 }
            ];

            await component.setProps({ histories });
        });

        test('should return correct style for first entry', () => {
            expect(component.vm.getFocusChangeStyle(0, false).height).toEqual(0);
            expect(component.vm.getFocusChangeStyle(0, false)['max-height']).toEqual(0);
            expect(component.vm.getFocusChangeStyle(0, false)['margin-top']).toBeFalsy();
            expect(component.vm.getFocusChangeStyle(0, false)['margin-bottom']).toBeFalsy();
        });

        test('should return correct style when subsequent entry is smaller', () => {
            expect(component.vm.getFocusChangeStyle(1, false).height).toEqual('12.5%');
            expect(component.vm.getFocusChangeStyle(1, false)['max-height']).toEqual('12.5%');
            expect(component.vm.getFocusChangeStyle(1, false)['margin-top']).toBeFalsy();
            expect(component.vm.getFocusChangeStyle(1, false)['margin-bottom']).toEqual('1px');
        });

        test('should return correct style when subsequent entry is larger', () => {
            expect(component.vm.getFocusChangeStyle(2, true).height).toEqual('37.5%');
            expect(component.vm.getFocusChangeStyle(2, true)['max-height']).toEqual('37.5%');
            expect(component.vm.getFocusChangeStyle(2, true)['margin-top']).toEqual('1px');
            expect(component.vm.getFocusChangeStyle(2, true)['margin-bottom']).toBeFalsy();
        });
    });

    describe('getBreakdownStyle', () => {
        test('should return correct breakdown style', () => {
            const breakdown: ActivityBreakdownDto = { regular: 4, recurring: 3, interruption: 2, overlearning: 1 };

            expect(component.vm.getBreakdownStyle(4, breakdown)['max-height']).toEqual('40%');
        });
    });
});
