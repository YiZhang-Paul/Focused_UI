import { Store } from 'vuex';
import { assert as sinonExpect, createStubInstance, SinonStubbedInstance } from 'sinon';

import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { WorkItemDto } from '../../core/dtos/work-item-dto';
import { FocusSessionDto } from '../../core/dtos/focus-session-dto';
import { BreakSession } from '../../core/models/time-session/break-session';
import { FocusSessionStartupOption } from '../../core/models/time-session/focus-session-startup-option';
import { BreakSessionStartupOption } from '../../core/models/time-session/break-session-startup-option';
import { WorkItemStatus } from '../../core/enums/work-item-status.enum';
import { WorkItemType } from '../../core/enums/work-item-type.enum';
import { TimeSessionStatus } from '../../core/enums/time-session-status.enum';
import { TimeSessionHttpService } from '../../core/services/http/time-session-http/time-session-http.service'

import { ITimeSessionState, createStore } from './time-session.state';

describe('time session store unit test', () => {
    const oneMinute = 60 * 1000;
    const oneHour = 60 * oneMinute;
    let store: Store<ITimeSessionState>;
    let timeSessionHttpStub: SinonStubbedInstance<TimeSessionHttpService>;

    beforeEach(() => {
        timeSessionHttpStub = createStubInstance(TimeSessionHttpService);

        container
            .rebind<TimeSessionHttpService>(types.TimeSessionHttpService)
            .toConstantValue(timeSessionHttpStub as unknown as TimeSessionHttpService);

        store = new Store(createStore());
    });

    describe('timeSessionStatus', () => {
        test('should return correct status when no session is active', () => {
            store.commit('setActiveFocusSession', null);
            store.commit('setActiveBreakSession', null);

            expect(store.getters['timeSessionStatus']).toEqual(TimeSessionStatus.Idle);
        });

        test('should return correct status during break session', () => {
            store.commit('setActiveFocusSession', null);
            store.commit('setActiveBreakSession', { ...new BreakSession(), id: '1' });

            expect(store.getters['timeSessionStatus']).toEqual(TimeSessionStatus.Resting);
        });

        test('should return correct status during focus session', () => {
            const session = new FocusSessionDto();
            store.commit('setActiveFocusSession', session);
            store.commit('setActiveBreakSession', null);

            session.workItems = [{ ...new WorkItemDto(), status: WorkItemStatus.Ongoing }];
            expect(store.getters['timeSessionStatus']).toEqual(TimeSessionStatus.Ongoing);

            session.workItems = [{ ...new WorkItemDto(), status: WorkItemStatus.Completed }];
            expect(store.getters['timeSessionStatus']).toEqual(TimeSessionStatus.Pending);
        });
    });

    describe('ongoingTimeSessionEnd', () => {
        test('should return correct session end for idle state', () => {
            store.commit('setActiveFocusSession', null);
            store.commit('setActiveBreakSession', null);

            expect(store.getters['ongoingTimeSessionEnd']).toBeNull();
        });

        test('should return correct session end for break session', () => {
            const session: BreakSession = {
                ...new BreakSession(),
                startTime: new Date(2021, 2, 1, 5, 15).toISOString(),
                targetDuration: 2.5
            };

            store.commit('setActiveFocusSession', null);
            store.commit('setActiveBreakSession', session);

            expect(store.getters['ongoingTimeSessionEnd']).toEqual(new Date(2021, 2, 1, 7, 45));
        });

        test('should return correct session end for focus session', () => {
            const session: FocusSessionDto = {
                ...new FocusSessionDto(),
                startTime: new Date(2022, 5, 2, 5, 15).toISOString(),
                targetDuration: 2.5
            };

            store.commit('setActiveFocusSession', session);
            store.commit('setActiveBreakSession', null);

            expect(store.getters['ongoingTimeSessionEnd']).toEqual(new Date(2022, 5, 2, 7, 45));
        });
    });

    describe('startFocusSession', () => {
        test('should return false when failed to start focus session', async() => {
            const option = new FocusSessionStartupOption(new WorkItemDto());
            timeSessionHttpStub.startFocusSession.resolves(false);

            const result = await store.dispatch('startFocusSession', option);

            sinonExpect.calledOnce(timeSessionHttpStub.startFocusSession);
            sinonExpect.notCalled(timeSessionHttpStub.getActiveFocusSessionMeta);
            sinonExpect.notCalled(timeSessionHttpStub.getActiveBreakSession);
            expect(result).toBeFalsy();
        });

        test('should return true when successfully started focus session', async() => {
            const option = new FocusSessionStartupOption(new WorkItemDto());
            timeSessionHttpStub.startFocusSession.resolves(true);

            const result = await store.dispatch('startFocusSession', option);

            sinonExpect.calledOnce(timeSessionHttpStub.startFocusSession);
            sinonExpect.calledOnce(timeSessionHttpStub.getActiveFocusSessionMeta);
            sinonExpect.calledOnce(timeSessionHttpStub.getActiveBreakSession);
            expect(result).toBeTruthy();
        });
    });

    describe('stopFocusSession', () => {
        test('should return false when failed to stop focus session', async() => {
            timeSessionHttpStub.stopFocusSession.resolves(false);

            const result = await store.dispatch('stopFocusSession', '1234');

            sinonExpect.calledOnce(timeSessionHttpStub.stopFocusSession);
            sinonExpect.notCalled(timeSessionHttpStub.getActiveFocusSessionMeta);
            sinonExpect.notCalled(timeSessionHttpStub.getActiveBreakSession);
            sinonExpect.notCalled(timeSessionHttpStub.getStaleFocusSessionMeta);
            sinonExpect.notCalled(timeSessionHttpStub.getStaleBreakSession);
            expect(result).toBeFalsy();
        });

        test('should return true when successfully stopped focus session', async() => {
            timeSessionHttpStub.stopFocusSession.resolves(true);

            const result = await store.dispatch('stopFocusSession', '1234');

            sinonExpect.calledOnce(timeSessionHttpStub.stopFocusSession);
            sinonExpect.calledOnce(timeSessionHttpStub.getActiveFocusSessionMeta);
            sinonExpect.calledOnce(timeSessionHttpStub.getActiveBreakSession);
            sinonExpect.calledOnce(timeSessionHttpStub.getStaleFocusSessionMeta);
            sinonExpect.calledOnce(timeSessionHttpStub.getStaleBreakSession);
            expect(result).toBeTruthy();
        });
    });

    describe('startBreakSession', () => {
        test('should return false when failed to start break session', async() => {
            const option = new BreakSessionStartupOption('1234', 5);
            timeSessionHttpStub.startBreakSession.resolves(false);

            const result = await store.dispatch('startBreakSession', option);

            sinonExpect.calledOnce(timeSessionHttpStub.startBreakSession);
            sinonExpect.notCalled(timeSessionHttpStub.getActiveFocusSessionMeta);
            sinonExpect.notCalled(timeSessionHttpStub.getActiveBreakSession);
            expect(result).toBeFalsy();
        });

        test('should return true when successfully started break session', async() => {
            const option = new BreakSessionStartupOption('1234', 5);
            timeSessionHttpStub.startBreakSession.resolves(true);

            const result = await store.dispatch('startBreakSession', option);

            sinonExpect.calledOnce(timeSessionHttpStub.startBreakSession);
            sinonExpect.calledOnce(timeSessionHttpStub.getActiveFocusSessionMeta);
            sinonExpect.calledOnce(timeSessionHttpStub.getActiveBreakSession);
            expect(result).toBeTruthy();
        });
    });

    describe('stopBreakSession', () => {
        test('should return false when failed to stop break session', async() => {
            timeSessionHttpStub.stopBreakSession.resolves(false);

            const result = await store.dispatch('stopBreakSession', '1234');

            sinonExpect.calledOnce(timeSessionHttpStub.stopBreakSession);
            sinonExpect.notCalled(timeSessionHttpStub.getActiveFocusSessionMeta);
            sinonExpect.notCalled(timeSessionHttpStub.getActiveBreakSession);
            sinonExpect.notCalled(timeSessionHttpStub.getStaleFocusSessionMeta);
            sinonExpect.notCalled(timeSessionHttpStub.getStaleBreakSession);
            expect(result).toBeFalsy();
        });

        test('should return true when successfully stopped break session', async() => {
            timeSessionHttpStub.stopBreakSession.resolves(true);

            const result = await store.dispatch('stopBreakSession', '1234');

            sinonExpect.calledOnce(timeSessionHttpStub.stopBreakSession);
            sinonExpect.calledOnce(timeSessionHttpStub.getActiveFocusSessionMeta);
            sinonExpect.calledOnce(timeSessionHttpStub.getActiveBreakSession);
            sinonExpect.calledOnce(timeSessionHttpStub.getStaleFocusSessionMeta);
            sinonExpect.calledOnce(timeSessionHttpStub.getStaleBreakSession);
            expect(result).toBeTruthy();
        });
    });

    describe('loadActiveTimeSession', () => {
        test('should load active time sessions', async() => {
            const focusSession: FocusSessionDto = { ...new FocusSessionDto(), id: '1' };
            const breakSession: BreakSession = { ...new BreakSession(), id: '2' };
            timeSessionHttpStub.getActiveFocusSessionMeta.resolves(focusSession);
            timeSessionHttpStub.getActiveBreakSession.resolves(breakSession);
            expect(store.getters['activeFocusSession']).not.toEqual(focusSession);
            expect(store.getters['activeBreakSession']).not.toEqual(breakSession);

            await store.dispatch('loadActiveTimeSession');

            sinonExpect.calledOnce(timeSessionHttpStub.getActiveFocusSessionMeta);
            sinonExpect.calledOnce(timeSessionHttpStub.getActiveBreakSession);
            expect(store.getters['activeFocusSession']).toEqual(focusSession);
            expect(store.getters['activeBreakSession']).toEqual(breakSession);
        });
    });

    describe('loadStaleTimeSession', () => {
        test('should load stale time sessions', async() => {
            const focusSession: FocusSessionDto = { ...new FocusSessionDto(), id: '1' };
            const breakSession: BreakSession = { ...new BreakSession(), id: '2' };
            timeSessionHttpStub.getStaleFocusSessionMeta.resolves(focusSession);
            timeSessionHttpStub.getStaleBreakSession.resolves(breakSession);
            expect(store.getters['staleFocusSession']).not.toEqual(focusSession);
            expect(store.getters['staleBreakSession']).not.toEqual(breakSession);

            await store.dispatch('loadStaleTimeSession');

            sinonExpect.calledOnce(timeSessionHttpStub.getStaleFocusSessionMeta);
            sinonExpect.calledOnce(timeSessionHttpStub.getStaleBreakSession);
            expect(store.getters['staleFocusSession']).toEqual(focusSession);
            expect(store.getters['staleBreakSession']).toEqual(breakSession);
        });
    });

    describe('syncActiveTimeSession', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        test('should reload when stale session detected', async() => {
            const startTime = new Date(Date.now() - oneHour - oneMinute).toISOString();
            const session: FocusSessionDto = { ...new FocusSessionDto(), startTime, targetDuration: 1 };
            store.commit('setActiveFocusSession', session);
            store.commit('setActiveBreakSession', null);

            await store.dispatch('syncActiveTimeSession');

            sinonExpect.calledOnce(timeSessionHttpStub.getActiveFocusSessionMeta);
            sinonExpect.calledOnce(timeSessionHttpStub.getActiveBreakSession);
            sinonExpect.calledOnce(timeSessionHttpStub.getStaleFocusSessionMeta);
            sinonExpect.calledOnce(timeSessionHttpStub.getStaleBreakSession);
        });

        test('should sync focus session time', () => {
            const startTime = new Date().toISOString();
            const workItem: WorkItemDto = { ...new WorkItemDto(), status: WorkItemStatus.Ongoing, type: WorkItemType.Regular };
            const session: FocusSessionDto = { ...new FocusSessionDto(), workItems: [workItem], startTime, targetDuration: 2 };
            const { regular, recurring, interruption, overlearning } = session.activities;

            store.dispatch('syncActiveTimeSession');
            store.commit('setActiveFocusSession', session);
            store.commit('setActiveBreakSession', null);

            workItem.type = WorkItemType.Regular;
            jest.advanceTimersByTime(oneHour * 2);
            expect(Math.round(session.activities.regular)).toEqual(regular + 2);
            expect(session.activities.recurring).toEqual(recurring);
            expect(session.activities.interruption).toEqual(interruption);
            expect(session.activities.overlearning).toEqual(overlearning);

            workItem.type = WorkItemType.Recurring;
            jest.advanceTimersByTime(oneHour * 2);
            expect(Math.round(session.activities.regular)).toEqual(regular + 2);
            expect(Math.round(session.activities.recurring)).toEqual(recurring + 2);
            expect(session.activities.interruption).toEqual(interruption);
            expect(session.activities.overlearning).toEqual(overlearning);

            workItem.type = WorkItemType.Interruption;
            jest.advanceTimersByTime(oneHour * 2);
            expect(Math.round(session.activities.regular)).toEqual(regular + 2);
            expect(Math.round(session.activities.recurring)).toEqual(recurring + 2);
            expect(Math.round(session.activities.interruption)).toEqual(interruption + 2);
            expect(session.activities.overlearning).toEqual(overlearning);

            workItem.status = WorkItemStatus.Completed;
            jest.advanceTimersByTime(oneHour * 2);
            expect(Math.round(session.activities.regular)).toEqual(regular + 2);
            expect(Math.round(session.activities.recurring)).toEqual(recurring + 2);
            expect(Math.round(session.activities.interruption)).toEqual(interruption + 2);
            expect(Math.round(session.activities.overlearning)).toEqual(overlearning + 2);
        });

        test('should sync break session time', () => {
            const startTime = new Date().toISOString();
            const session: BreakSession = { ...new BreakSession(), id: '1', startTime, targetDuration: 2 };

            store.dispatch('syncActiveTimeSession');
            store.commit('setActiveFocusSession', null);
            store.commit('setActiveBreakSession', session);

            jest.advanceTimersByTime(1000);

            expect(store.getters['activeBreakSession']).toEqual(session);
        });
    });
});
