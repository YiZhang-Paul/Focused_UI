import { assert as sinonExpect, createStubInstance, SinonStubbedInstance } from 'sinon';

import { createStore } from '../../store';
import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { WorkItemDto } from '../../core/dtos/work-item-dto';
import { FocusSessionDto } from '../../core/dtos/focus-session-dto';
import { BreakSession } from '../../core/models/time-session/break-session';
import { FocusSessionStartupOption } from '../../core/models/time-session/focus-session-startup-option';
import { BreakSessionStartupOption } from '../../core/models/time-session/break-session-startup-option';
import { WorkItemStatus } from '../../core/enums/work-item-status.enum';
import { TimeSessionStatus } from '../../core/enums/time-session-status.enum';
import { TimeSessionHttpService } from '../../core/services/http/time-session-http/time-session-http.service'

describe('time session store unit test', () => {
    const oneMinute = 60 * 1000;
    const oneHour = 60 * oneMinute;
    let store: ReturnType<typeof createStore>;
    let timeSessionHttpStub: SinonStubbedInstance<TimeSessionHttpService>;

    beforeEach(() => {
        timeSessionHttpStub = createStubInstance(TimeSessionHttpService);

        container
            .rebind<TimeSessionHttpService>(types.TimeSessionHttpService)
            .toConstantValue(timeSessionHttpStub as unknown as TimeSessionHttpService);

        store = createStore();
    });

    describe('timeSessionStatus', () => {
        test('should return correct status when no session is active', () => {
            store.timeSession.commit(store.store, store.timeSession.mutation.SetActiveFocusSession, null);
            store.timeSession.commit(store.store, store.timeSession.mutation.SetActiveBreakSession, null);

            expect(store.timeSession.getters(store.store, store.timeSession.getter.TimeSessionStatus)).toEqual(TimeSessionStatus.Idle);
        });

        test('should return correct status during break session', () => {
            store.timeSession.commit(store.store, store.timeSession.mutation.SetActiveFocusSession, null);
            store.timeSession.commit(store.store, store.timeSession.mutation.SetActiveBreakSession, { ...new BreakSession(), id: '1' });

            expect(store.timeSession.getters(store.store, store.timeSession.getter.TimeSessionStatus)).toEqual(TimeSessionStatus.Resting);
        });

        test('should return correct status during focus session', () => {
            const session = new FocusSessionDto();
            store.timeSession.commit(store.store, store.timeSession.mutation.SetActiveFocusSession, session);
            store.timeSession.commit(store.store, store.timeSession.mutation.SetActiveBreakSession, null);

            session.workItems = [{ ...new WorkItemDto(), status: WorkItemStatus.Ongoing }];
            expect(store.timeSession.getters(store.store, store.timeSession.getter.TimeSessionStatus)).toEqual(TimeSessionStatus.Ongoing);

            session.workItems = [{ ...new WorkItemDto(), status: WorkItemStatus.Completed }];
            expect(store.timeSession.getters(store.store, store.timeSession.getter.TimeSessionStatus)).toEqual(TimeSessionStatus.Pending);
        });
    });

    describe('ongoingTimeSessionEnd', () => {
        test('should return correct session end for idle state', () => {
            store.timeSession.commit(store.store, store.timeSession.mutation.SetActiveFocusSession, null);
            store.timeSession.commit(store.store, store.timeSession.mutation.SetActiveBreakSession, null);

            expect(store.timeSession.getters(store.store, store.timeSession.getter.OngoingTimeSessionEnd)).toBeNull();
        });

        test('should return correct session end for break session', () => {
            const session: BreakSession = {
                ...new BreakSession(),
                startTime: new Date(2021, 2, 1, 5, 15).toISOString(),
                targetDuration: 2.5
            };

            store.timeSession.commit(store.store, store.timeSession.mutation.SetActiveFocusSession, null);
            store.timeSession.commit(store.store, store.timeSession.mutation.SetActiveBreakSession, session);

            expect(store.timeSession.getters(store.store, store.timeSession.getter.OngoingTimeSessionEnd)).toEqual(new Date(2021, 2, 1, 7, 45));
        });

        test('should return correct session end for focus session', () => {
            const session: FocusSessionDto = {
                ...new FocusSessionDto(),
                startTime: new Date(2022, 5, 2, 5, 15).toISOString(),
                targetDuration: 2.5
            };

            store.timeSession.commit(store.store, store.timeSession.mutation.SetActiveFocusSession, session);
            store.timeSession.commit(store.store, store.timeSession.mutation.SetActiveBreakSession, null);

            expect(store.timeSession.getters(store.store, store.timeSession.getter.OngoingTimeSessionEnd)).toEqual(new Date(2022, 5, 2, 7, 45));
        });
    });

    describe('startFocusSession', () => {
        test('should return false when failed to start focus session', async() => {
            const option = new FocusSessionStartupOption('1234', 25);
            timeSessionHttpStub.startFocusSession.resolves(false);

            const result = await store.timeSession.dispatch(store.store, store.timeSession.action.StartFocusSession, option);

            sinonExpect.calledOnce(timeSessionHttpStub.startFocusSession);
            sinonExpect.notCalled(timeSessionHttpStub.getActiveFocusSessionMeta);
            sinonExpect.notCalled(timeSessionHttpStub.getActiveBreakSession);
            expect(result).toBeFalsy();
        });

        test('should return true when successfully started focus session', async() => {
            const option = new FocusSessionStartupOption('1234', 25);
            timeSessionHttpStub.startFocusSession.resolves(true);

            const result = await store.timeSession.dispatch(store.store, store.timeSession.action.StartFocusSession, option);

            sinonExpect.calledOnce(timeSessionHttpStub.startFocusSession);
            sinonExpect.calledOnce(timeSessionHttpStub.getActiveFocusSessionMeta);
            sinonExpect.calledOnce(timeSessionHttpStub.getActiveBreakSession);
            expect(result).toBeTruthy();
        });
    });

    describe('stopFocusSession', () => {
        test('should return false when failed to stop focus session', async() => {
            timeSessionHttpStub.stopFocusSession.resolves(false);

            const result = await store.timeSession.dispatch(store.store, store.timeSession.action.StopFocusSession, '1234');

            sinonExpect.calledOnce(timeSessionHttpStub.stopFocusSession);
            sinonExpect.notCalled(timeSessionHttpStub.getActiveFocusSessionMeta);
            sinonExpect.notCalled(timeSessionHttpStub.getActiveBreakSession);
            sinonExpect.notCalled(timeSessionHttpStub.getStaleFocusSessionMeta);
            sinonExpect.notCalled(timeSessionHttpStub.getStaleBreakSession);
            expect(result).toBeFalsy();
        });

        test('should return true when successfully stopped focus session', async() => {
            timeSessionHttpStub.stopFocusSession.resolves(true);

            const result = await store.timeSession.dispatch(store.store, store.timeSession.action.StopFocusSession, '1234');

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

            const result = await store.timeSession.dispatch(store.store, store.timeSession.action.StartBreakSession, option);

            sinonExpect.calledOnce(timeSessionHttpStub.startBreakSession);
            sinonExpect.notCalled(timeSessionHttpStub.getActiveFocusSessionMeta);
            sinonExpect.notCalled(timeSessionHttpStub.getActiveBreakSession);
            expect(result).toBeFalsy();
        });

        test('should return true when successfully started break session', async() => {
            const option = new BreakSessionStartupOption('1234', 5);
            timeSessionHttpStub.startBreakSession.resolves(true);

            const result = await store.timeSession.dispatch(store.store, store.timeSession.action.StartBreakSession, option);

            sinonExpect.calledOnce(timeSessionHttpStub.startBreakSession);
            sinonExpect.calledOnce(timeSessionHttpStub.getActiveFocusSessionMeta);
            sinonExpect.calledOnce(timeSessionHttpStub.getActiveBreakSession);
            expect(result).toBeTruthy();
        });
    });

    describe('stopBreakSession', () => {
        test('should return false when failed to stop break session', async() => {
            timeSessionHttpStub.stopBreakSession.resolves(false);

            const result = await store.timeSession.dispatch(store.store, store.timeSession.action.StopBreakSession, '1234');

            sinonExpect.calledOnce(timeSessionHttpStub.stopBreakSession);
            sinonExpect.notCalled(timeSessionHttpStub.getActiveFocusSessionMeta);
            sinonExpect.notCalled(timeSessionHttpStub.getActiveBreakSession);
            sinonExpect.notCalled(timeSessionHttpStub.getStaleFocusSessionMeta);
            sinonExpect.notCalled(timeSessionHttpStub.getStaleBreakSession);
            expect(result).toBeFalsy();
        });

        test('should return true when successfully stopped break session', async() => {
            timeSessionHttpStub.stopBreakSession.resolves(true);

            const result = await store.timeSession.dispatch(store.store, store.timeSession.action.StopBreakSession, '1234');

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
            expect(store.timeSession.getters(store.store, store.timeSession.getter.ActiveFocusSession)).not.toEqual(focusSession);
            expect(store.timeSession.getters(store.store, store.timeSession.getter.ActiveBreakSession)).not.toEqual(breakSession);

            await store.timeSession.dispatch(store.store, store.timeSession.action.LoadActiveTimeSession);

            sinonExpect.calledOnce(timeSessionHttpStub.getActiveFocusSessionMeta);
            sinonExpect.calledOnce(timeSessionHttpStub.getActiveBreakSession);
            expect(store.timeSession.getters(store.store, store.timeSession.getter.ActiveFocusSession)).toEqual(focusSession);
            expect(store.timeSession.getters(store.store, store.timeSession.getter.ActiveBreakSession)).toEqual(breakSession);
        });
    });

    describe('loadStaleTimeSession', () => {
        test('should load stale time sessions', async() => {
            const focusSession: FocusSessionDto = { ...new FocusSessionDto(), id: '1' };
            const breakSession: BreakSession = { ...new BreakSession(), id: '2' };
            timeSessionHttpStub.getStaleFocusSessionMeta.resolves(focusSession);
            timeSessionHttpStub.getStaleBreakSession.resolves(breakSession);
            expect(store.timeSession.getters(store.store, store.timeSession.getter.StaleFocusSession)).not.toEqual(focusSession);
            expect(store.timeSession.getters(store.store, store.timeSession.getter.StaleBreakSession)).not.toEqual(breakSession);

            await store.timeSession.dispatch(store.store, store.timeSession.action.LoadStaleTimeSession);

            sinonExpect.calledOnce(timeSessionHttpStub.getStaleFocusSessionMeta);
            sinonExpect.calledOnce(timeSessionHttpStub.getStaleBreakSession);
            expect(store.timeSession.getters(store.store, store.timeSession.getter.StaleFocusSession)).toEqual(focusSession);
            expect(store.timeSession.getters(store.store, store.timeSession.getter.StaleBreakSession)).toEqual(breakSession);
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
            store.timeSession.commit(store.store, store.timeSession.mutation.SetActiveFocusSession, session);
            store.timeSession.commit(store.store, store.timeSession.mutation.SetActiveBreakSession, null);

            await store.timeSession.dispatch(store.store, store.timeSession.action.SyncActiveTimeSession);

            sinonExpect.calledOnce(timeSessionHttpStub.getActiveFocusSessionMeta);
            sinonExpect.calledOnce(timeSessionHttpStub.getActiveBreakSession);
            sinonExpect.calledOnce(timeSessionHttpStub.getStaleFocusSessionMeta);
            sinonExpect.calledOnce(timeSessionHttpStub.getStaleBreakSession);
        });

        test('should sync focus session time', () => {
            const startTime = new Date().toISOString();
            const session: FocusSessionDto = { ...new FocusSessionDto(), startTime, targetDuration: 2 };

            store.timeSession.dispatch(store.store, store.timeSession.action.SyncActiveTimeSession);
            store.timeSession.commit(store.store, store.timeSession.mutation.SetActiveFocusSession, session);
            store.timeSession.commit(store.store, store.timeSession.mutation.SetActiveBreakSession, null);

            jest.advanceTimersByTime(1000);

            expect(store.timeSession.getters(store.store, store.timeSession.getter.ActiveFocusSession)).toEqual(session);
        });

        test('should sync break session time', () => {
            const startTime = new Date().toISOString();
            const session: BreakSession = { ...new BreakSession(), id: '1', startTime, targetDuration: 2 };

            store.timeSession.dispatch(store.store, store.timeSession.action.SyncActiveTimeSession);
            store.timeSession.commit(store.store, store.timeSession.mutation.SetActiveFocusSession, null);
            store.timeSession.commit(store.store, store.timeSession.mutation.SetActiveBreakSession, session);

            jest.advanceTimersByTime(1000);

            expect(store.timeSession.getters(store.store, store.timeSession.getter.ActiveBreakSession)).toEqual(session);
        });
    });
});
