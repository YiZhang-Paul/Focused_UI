import { shallowMount, VueWrapper } from '@vue/test-utils';

import { FocusSessionDto } from '../../../core/dtos/focus-session-dto';
import { ActivityBreakdownDto } from '../../../core/dtos/activity-breakdown-dto';

import FocusSessionStopDialog from './focus-session-stop-dialog.vue';

describe('focus session stop dialog unit test', () => {
    const oneMinute = 1000 * 60;
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(FocusSessionStopDialog);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('stopOption', () => {
        test('should return correct stop option', async() => {
            const data: FocusSessionDto = {
                ...new FocusSessionDto(),
                id: '1234',
                startTime: new Date(Date.now() - oneMinute * 30).toISOString(),
                targetDuration: 0.5
            };

            await component.setProps({ data });

            expect(component.vm.stopOption.focusSessionId).toEqual('1234');
            expect(component.vm.stopOption.breakSessionDuration).toEqual(6);
        });
    });

    describe('isStale', () => {
        test('should return false for active session', async() => {
            const data: FocusSessionDto = {
                ...new FocusSessionDto(),
                startTime: new Date(Date.now() - oneMinute * 30).toISOString(),
                targetDuration: 1
            };

            await component.setProps({ data });

            expect(component.vm.isStale).toBeFalsy();
        });

        test('should return true for stale session', async() => {
            const data: FocusSessionDto = {
                ...new FocusSessionDto(),
                startTime: new Date(Date.now() - oneMinute * 30).toISOString(),
                targetDuration: 0.25
            };

            await component.setProps({ data });

            expect(component.vm.isStale).toBeTruthy();
        });
    });

    describe('focusChange', () => {
        test('should return focus change', async() => {
            const data: FocusSessionDto = {
                ...new FocusSessionDto(),
                activities: {
                    ...new ActivityBreakdownDto(),
                    regular: 0.2,
                    recurring: 0,
                    overlearning: 0.3
                }
            };

            await component.setProps({ data });

            expect(component.vm.focusChange).toEqual('+6.3%');
        });
    });

    describe('breakIcon', () => {
        test('should return break icon', () => {
            expect(component.vm.breakIcon).not.toBeNull();
        });
    });

    describe('breakDuration', () => {
        test('should return zero for ineligible focus session', async() => {
            const data: FocusSessionDto = {
                ...new FocusSessionDto(),
                startTime: new Date(Date.now() - oneMinute * 14).toISOString(),
                targetDuration: 0.5
            };

            await component.setProps({ data });

            expect(component.vm.breakDuration).toEqual(0);
        });

        test('should return break duration for eligible focus session', async() => {
            const data: FocusSessionDto = {
                ...new FocusSessionDto(),
                startTime: new Date(Date.now() - oneMinute * 15).toISOString(),
                targetDuration: 0.5
            };

            await component.setProps({ data });

            expect(component.vm.breakDuration).toEqual(3);
        });
    });

    describe('targetEnd', () => {
        test('should return correct target end time', async() => {
            const data: FocusSessionDto = {
                ...new FocusSessionDto(),
                startTime: new Date(2021, 1, 5, 17, 15, 0).toISOString(),
                targetDuration: 0.5
            };

            await component.setProps({ data });

            expect(component.vm.targetEnd).toEqual(1612565100000);
        });
    });
});
