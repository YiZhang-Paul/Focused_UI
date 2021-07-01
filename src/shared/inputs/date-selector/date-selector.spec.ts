import { shallowMount, VueWrapper } from '@vue/test-utils';

import DateSelector from './date-selector.vue';

describe('date selector unit test', () => {
    let component: VueWrapper<any>;
    let now: Date;

    beforeEach(() => {
        component = shallowMount(DateSelector);
        now = new Date();
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('selectedMonthAndDate', () => {
        test('should return empty string when no date selected', () => {
            expect(component.vm.selected).toBeNull();
            expect(component.vm.selectedMonthAndDate).toEqual('');
        });

        test('should return selected month and date', async() => {
            await component.setProps({ modelValue: new Date(2021, 2, 3) });

            expect(component.vm.selectedMonthAndDate).toEqual('March 3');
        });
    });

    describe('selectedDateSuffix', () => {
        test('should return empty string when no date selected', () => {
            expect(component.vm.selected).toBeNull();
            expect(component.vm.selectedDateSuffix).toEqual('');
        });

        test('should return selected date suffix', async() => {
            await component.setProps({ modelValue: new Date(2021, 2, 3) });

            expect(component.vm.selectedDateSuffix).toEqual('rd');
        });
    });

    describe('allowPreviousMonth', () => {
        test('should return false when previous month is not allowed', () => {
            component.vm.panelDate = new Date(now.getFullYear() - 1, 2, 3);
            expect(component.vm.allowPreviousMonth).toBeFalsy();

            component.vm.panelDate = new Date(now.getFullYear(), now.getMonth(), 3);
            expect(component.vm.allowPreviousMonth).toBeFalsy();
        });

        test('should return true when previous month is allowed', () => {
            component.vm.panelDate = new Date(now.getFullYear() + 1, 2, 3);
            expect(component.vm.allowPreviousMonth).toBeTruthy();

            if (now.getMonth() !== 11) {
                component.vm.panelDate = new Date(now.getFullYear(), now.getMonth() + 1, 3);
                expect(component.vm.allowPreviousMonth).toBeTruthy();
            }
        });
    });

    describe('panelMonthAndYear', () => {
        test('should return correct month and year', () => {
            component.vm.panelDate = new Date(2021, 3, 3);

            expect(component.vm.panelMonthAndYear).toEqual('Apr 2021');
        });
    });

    describe('getDayOptionClasses', () => {
        test('should return correct classes', () => {
            component = shallowMount(DateSelector, { props: { modelValue: new Date(2021, 6, 1) } });

            const result = component.vm.getDayOptionClasses(1, 1);

            expect(result['unselectable-day']).toBeTruthy();
            expect(result.today).toBeFalsy();
            expect(result['selected-day']).toBeFalsy();
        });
    });

    describe('moveMonth', () => {
        test('should do nothing when not allowed to move to previous month', () => {
            component.vm.panelDate = new Date(now.getFullYear(), now.getMonth(), 1);

            component.vm.moveMonth(false);

            expect(component.vm.panelDate.getFullYear()).toEqual(now.getFullYear());
            expect(component.vm.panelDate.getMonth()).toEqual(now.getMonth());
        });

        test('should move to previous year when applicable', () => {
            component.vm.panelDate = new Date(now.getFullYear() + 1, 0, 1);

            component.vm.moveMonth(false);

            expect(component.vm.panelDate.getFullYear()).toEqual(now.getFullYear());
        });

        test('should move to next year when applicable', () => {
            component.vm.panelDate = new Date(now.getFullYear(), 11, 1);

            component.vm.moveMonth(true);

            expect(component.vm.panelDate.getFullYear()).toEqual(now.getFullYear() + 1);
        });

        test('should move to previous month', () => {
            component.vm.panelDate = new Date(now.getFullYear() + 1, 11, 1);

            component.vm.moveMonth(false);

            expect(component.vm.panelDate.getFullYear()).toEqual(now.getFullYear() + 1);
            expect(component.vm.panelDate.getMonth()).toEqual(10);
        });

        test('should move to next month', () => {
            component.vm.panelDate = new Date(now.getFullYear() + 1, 7, 1);

            component.vm.moveMonth(true);

            expect(component.vm.panelDate.getFullYear()).toEqual(now.getFullYear() + 1);
            expect(component.vm.panelDate.getMonth()).toEqual(8);
        });
    });

    describe('onDateSelect', () => {
        test('should not emit anything when date is not selectable', () => {
            component = shallowMount(DateSelector, { props: { modelValue: new Date(2021, 6, 1) } });

            component.vm.onDateSelect(1, 1);

            expect(component.emitted()['update:modelValue']).toBeFalsy();
        });

        test('should emit selected date and close date selection panel', () => {
            component = shallowMount(DateSelector, { props: { modelValue: new Date(2022, 10, 1) } });
            component.vm.showOptions = true;

            component.vm.onDateSelect(1, 3);

            expect(component.emitted()['update:modelValue'].length).toEqual(1);
            expect(component.emitted()['update:modelValue'][0]).toEqual([new Date(2022, 10, 1)]);
            expect(component.vm.showOptions).toBeFalsy();
        });
    });

    describe('getDate', () => {
        test('should return correct date', () => {
            component = shallowMount(DateSelector, { props: { modelValue: new Date(2021, 10, 1) } });

            expect(component.vm.getDate(1, 1).getFullYear()).toEqual(2021);
            expect(component.vm.getDate(1, 1).getMonth()).toEqual(9);
            expect(component.vm.getDate(1, 1).getDate()).toEqual(31);

            expect(component.vm.getDate(3, 4).getFullYear()).toEqual(2021);
            expect(component.vm.getDate(3, 4).getMonth()).toEqual(10);
            expect(component.vm.getDate(3, 4).getDate()).toEqual(17);

            expect(component.vm.getDate(5, 5).getFullYear()).toEqual(2021);
            expect(component.vm.getDate(5, 5).getMonth()).toEqual(11);
            expect(component.vm.getDate(5, 5).getDate()).toEqual(2);
        });

        test('should return correct date in previous year', () => {
            component = shallowMount(DateSelector, { props: { modelValue: new Date(2022, 0, 1) } });

            expect(component.vm.getDate(1, 1).getFullYear()).toEqual(2021);
            expect(component.vm.getDate(1, 1).getMonth()).toEqual(11);
            expect(component.vm.getDate(1, 1).getDate()).toEqual(26);
        });

        test('should return correct date in next year', () => {
            component = shallowMount(DateSelector, { props: { modelValue: new Date(2021, 11, 1) } });

            expect(component.vm.getDate(5, 7).getFullYear()).toEqual(2022);
            expect(component.vm.getDate(5, 7).getMonth()).toEqual(0);
            expect(component.vm.getDate(5, 7).getDate()).toEqual(1);
        });
    });
});
