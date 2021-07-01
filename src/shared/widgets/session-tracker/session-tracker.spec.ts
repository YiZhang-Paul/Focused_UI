import { shallowMount, VueWrapper } from '@vue/test-utils';
import { createStore, Store } from 'vuex';

import { createStore as createTimeSessionStore, timeSessionKey } from '../../../store/time-session/time-session.state';
import { WorkItemDto } from '../../../core/dtos/work-item-dto';
import { FocusSessionDto } from '../../../core/dtos/focus-session-dto';
import { BreakSession } from '../../../core/models/time-session/break-session';
import { PercentageSeries } from '../../../core/models/progress-bar/percentage-series';
import { WorkItemStatus } from '../../../core/enums/work-item-status.enum';

import SessionTracker from './session-tracker.vue';

describe('session tracker unit test', () => {
    const focusSessionMutation = `${timeSessionKey}/setActiveFocusSession`;
    const breakSessionMutation = `${timeSessionKey}/setActiveBreakSession`;
    let component: VueWrapper<any>;
    let store: Store<any>;

    beforeEach(() => {
        store = createStore({ modules: { [timeSessionKey]: createTimeSessionStore() } });
        component = shallowMount(SessionTracker, { global: { mocks: { $store: store } } });
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('containerStyle', () => {
        test('should return correct container style', () => {
            store.commit(focusSessionMutation, null);
            store.commit(breakSessionMutation, null);

            const result = component.vm.containerStyle;

            expect(/session-status-colors-idle/.test(result.border)).toBeTruthy();
            expect(/session-status-colors-idle/.test(result['background-color'])).toBeTruthy();
            expect(/session-status-colors-idle/.test(result.color)).toBeTruthy();
            expect(/session-status-colors-idle/.test(result['text-shadow'])).toBeTruthy();
        });
    });

    describe('verticalGuardStyle', () => {
        test('should return correct style', () => {
            store.commit(focusSessionMutation, null);
            store.commit(breakSessionMutation, null);

            const result = component.vm.verticalGuardStyle;

            expect(/session-status-colors-idle/.test(result['background-color'])).toBeTruthy();
            expect(/session-status-colors-idle/.test(result['box-shadow'])).toBeTruthy();
        });
    });

    describe('horizontalGuardStyle', () => {
        test('should return correct style', () => {
            store.commit(focusSessionMutation, null);
            store.commit(breakSessionMutation, null);

            const result = component.vm.horizontalGuardStyle;

            expect(/session-status-colors-idle/.test(result['box-shadow'])).toBeTruthy();
            expect(/session-status-colors-idle/.test(result.background)).toBeTruthy();
        });
    });

    describe('title', () => {
        test('should return correct title for idle state', () => {
            store.commit(focusSessionMutation, null);
            store.commit(breakSessionMutation, null);

            expect(component.vm.title).toEqual('no active item.');
        });

        test('should return correct title for resting state', () => {
            store.commit(focusSessionMutation, null);
            store.commit(breakSessionMutation, new BreakSession());

            expect(component.vm.title).toEqual('taking a break...');
        });

        test('should return correct title for pending state', () => {
            store.commit(focusSessionMutation, new FocusSessionDto());
            store.commit(breakSessionMutation, null);

            expect(component.vm.title).toEqual('waiting for next item...');
        });

        test('should return correct title for ongoing state', () => {
            const session: FocusSessionDto = {
                ...new FocusSessionDto(),
                workItems: [{ ...new WorkItemDto(), name: 'item_name', status: WorkItemStatus.Ongoing }]
            };

            store.commit(focusSessionMutation, session);
            store.commit(breakSessionMutation, null);

            expect(component.vm.title).toEqual('item_name');
        });

        test('should return correct title when work item name is missing', () => {
            const session: FocusSessionDto = {
                ...new FocusSessionDto(),
                workItems: [{ ...new WorkItemDto(), status: WorkItemStatus.Ongoing }]
            };

            store.commit(focusSessionMutation, session);
            store.commit(breakSessionMutation, null);

            expect(component.vm.title).toEqual('N/A');
        });
    });

    describe('dropItemText', () => {
        test('should return correct drop item text for idle state', () => {
            store.commit(focusSessionMutation, null);
            store.commit(breakSessionMutation, null);

            expect(component.vm.dropItemText).toEqual('drop to start');
        });

        test('should return correct drop item text for resting state', () => {
            store.commit(focusSessionMutation, null);
            store.commit(breakSessionMutation, new BreakSession());

            expect(component.vm.dropItemText).toEqual('drop to start');
        });

        test('should return correct drop item text for pending state', () => {
            store.commit(focusSessionMutation, new FocusSessionDto());
            store.commit(breakSessionMutation, null);

            expect(component.vm.dropItemText).toEqual('drop to continue');
        });

        test('should return correct drop item text for ongoing state', () => {
            const session: FocusSessionDto = {
                ...new FocusSessionDto(),
                workItems: [{ ...new WorkItemDto(), status: WorkItemStatus.Ongoing }]
            };

            store.commit(focusSessionMutation, session);
            store.commit(breakSessionMutation, null);

            expect(component.vm.dropItemText).toEqual('drop to swap');
        });
    });

    describe('progressSeries', () => {
        test('should return correct progression series for idle state', () => {
            store.commit(focusSessionMutation, null);
            store.commit(breakSessionMutation, null);

            expect(component.vm.progressSeries).toEqual([]);
        });

        test('should return correct progression series for break session', () => {
            const session: BreakSession = {
                ...new BreakSession(),
                startTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
                targetDuration: 2
            };

            store.commit(focusSessionMutation, null);
            store.commit(breakSessionMutation, session);

            const result = component.vm.progressSeries;

            expect(result.length).toEqual(1);
            expect(Math.round(result[0].percent)).toEqual(50);
            expect(result[0].colorType).toEqual('session-status-colors-resting');
        });

        test('should return correct progression series for focus session', () => {
            const expected: PercentageSeries[] = [
                { percent: 60, colorType: 'activity-colors-regular' },
                { percent: 20, colorType: 'activity-colors-overlearning' }
            ];

            const session: FocusSessionDto = {
                ...new FocusSessionDto(),
                activities: { regular: 1, recurring: 1, interruption: 1, overlearning: 1 },
                targetDuration: 5
            };

            store.commit(focusSessionMutation, session);
            store.commit(breakSessionMutation, null);

            expect(component.vm.progressSeries).toEqual(expected);
        });
    });

    describe('sessionEnd', () => {
        test('should return correct session end for idle state', () => {
            store.commit(focusSessionMutation, null);
            store.commit(breakSessionMutation, null);

            expect(component.vm.sessionEnd).toBeNull();
        });

        test('should return correct session end for break session', () => {
            const session: BreakSession = {
                ...new BreakSession(),
                startTime: new Date(2021, 2, 1, 5, 15).toISOString(),
                targetDuration: 2.5
            };

            store.commit(focusSessionMutation, null);
            store.commit(breakSessionMutation, session);

            expect(component.vm.sessionEnd).toEqual(new Date(2021, 2, 1, 7, 45));
        });

        test('should return correct session end for focus session', () => {
            const session: FocusSessionDto = {
                ...new FocusSessionDto(),
                startTime: new Date(2022, 5, 2, 5, 15).toISOString(),
                targetDuration: 2.5
            };

            store.commit(focusSessionMutation, session);
            store.commit(breakSessionMutation, null);

            expect(component.vm.sessionEnd).toEqual(new Date(2022, 5, 2, 7, 45));
        });
    });

    describe('colorType', () => {
        test('should return correct color type for idle state', () => {
            store.commit(focusSessionMutation, null);
            store.commit(breakSessionMutation, null);

            expect(component.vm.colorType).toEqual('session-status-colors-idle');
        });

        test('should return correct color type for resting state', () => {
            store.commit(focusSessionMutation, null);
            store.commit(breakSessionMutation, new BreakSession());

            expect(component.vm.colorType).toEqual('session-status-colors-resting');
        });

        test('should return correct color type for pending state', () => {
            store.commit(focusSessionMutation, new FocusSessionDto());
            store.commit(breakSessionMutation, null);

            expect(component.vm.colorType).toEqual('session-status-colors-pending');
        });

        test('should return correct color type for ongoing state', () => {
            const session: FocusSessionDto = {
                ...new FocusSessionDto,
                workItems: [{ ...new WorkItemDto(), status: WorkItemStatus.Ongoing }]
            };

            store.commit(focusSessionMutation, session);
            store.commit(breakSessionMutation, null);

            expect(component.vm.colorType).toEqual('session-status-colors-ongoing');
        });
    });
});
