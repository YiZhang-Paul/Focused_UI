import { createStore, Store } from 'vuex';
import { assert as sinonExpect, createStubInstance, SinonStubbedInstance } from 'sinon';

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

import { ITimeSessionState } from './time-session.state';
import { TimeSessionGetter } from './time-session.getters';
import { TimeSessionMutation } from './time-session.mutations';
import { TimeSessionAction } from './time-session.actions';
import { createStore as createTimeSessionStore, timeSessionCommit, timeSessionDispatch, timeSessionGetters, timeSessionKey } from './time-session.store';

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

        store = createStore({ modules: { [timeSessionKey]: createTimeSessionStore() } });
    });

    describe('timeSessionStatus', () => {
        test('should return correct status when no session is active', () => {
            timeSessionCommit(store, TimeSessionMutation.SetActiveFocusSession, null);
            timeSessionCommit(store, TimeSessionMutation.SetActiveBreakSession, null);

            expect(timeSessionGetters(store, TimeSessionGetter.TimeSessionStatus)).toEqual(TimeSessionStatus.Idle);
        });

        test('should return correct status during break session', () => {
            timeSessionCommit(store, TimeSessionMutation.SetActiveFocusSession, null);
            timeSessionCommit(store, TimeSessionMutation.SetActiveBreakSession, { ...new BreakSession(), id: '1' });

            expect(timeSessionGetters(store, TimeSessionGetter.TimeSessionStatus)).toEqual(TimeSessionStatus.Resting);
        });

        test('should return correct status during focus session', () => {
            const session = new FocusSessionDto();
            timeSessionCommit(store, TimeSessionMutation.SetActiveFocusSession, session);
            timeSessionCommit(store, TimeSessionMutation.SetActiveBreakSession, null);

            session.workItems = [{ ...new WorkItemDto(), status: WorkItemStatus.Ongoing }];
            expect(timeSessionGetters(store, TimeSessionGetter.TimeSessionStatus)).toEqual(TimeSessionStatus.Ongoing);

            session.workItems = [{ ...new WorkItemDto(), status: WorkItemStatus.Completed }];
            expect(timeSessionGetters(store, TimeSessionGetter.TimeSessionStatus)).toEqual(TimeSessionStatus.Pending);
        });
    });

    describe('ongoingTimeSessionEnd', () => {
        test('should return correct session end for idle state', () => {
            timeSessionCommit(store, TimeSessionMutation.SetActiveFocusSession, null);
            timeSessionCommit(store, TimeSessionMutation.SetActiveBreakSession, null);

            expect(timeSessionGetters(store, TimeSessionGetter.OngoingTimeSessionEnd)).toBeNull();
        });

        test('should return correct session end for break session', () => {
            const session: BreakSession = {
                ...new BreakSession(),
                startTime: new Date(2021, 2, 1, 5, 15).toISOString(),
                targetDuration: 2.5
            };

            timeSessionCommit(store, TimeSessionMutation.SetActiveFocusSession, null);
            timeSessionCommit(store, TimeSessionMutation.SetActiveBreakSession, session);

            expect(timeSessionGetters(store, TimeSessionGetter.OngoingTimeSessionEnd)).toEqual(new Date(2021, 2, 1, 7, 45));
        });

        test('should return correct session end for focus session', () => {
            const session: FocusSessionDto = {
                ...new FocusSessionDto(),
                startTime: new Date(2022, 5, 2, 5, 15).toISOString(),
                targetDuration: 2.5
            };

            timeSessionCommit(store, TimeSessionMutation.SetActiveFocusSession, session);
            timeSessionCommit(store, TimeSessionMutation.SetActiveBreakSession, null);

            expect(timeSessionGetters(store, TimeSessionGetter.OngoingTimeSessionEnd)).toEqual(new Date(2022, 5, 2, 7, 45));
        });
    });

    describe('startFocusSession', () => {
        test('should return false when failed to start focus session', async() => {
            const option = new FocusSessionStartupOption('1234', 25);
            timeSessionHttpStub.startFocusSession.resolves(false);

            const result = await timeSessionDispatch(store, TimeSessionAction.StartFocusSession, option);

            sinonExpect.calledOnce(timeSessionHttpStub.startFocusSession);
            sinonExpect.notCalled(timeSessionHttpStub.getActiveFocusSessionMeta);
            sinonExpect.notCalled(timeSessionHttpStub.getActiveBreakSession);
            expect(result).toBeFalsy();
        });

        test('should return true when successfully started focus session', async() => {
            const option = new FocusSessionStartupOption('1234', 25);
            timeSessionHttpStub.startFocusSession.resolves(true);

            const result = await timeSessionDispatch(store, TimeSessionAction.StartFocusSession, option);

            sinonExpect.calledOnce(timeSessionHttpStub.startFocusSession);
            sinonExpect.calledOnce(timeSessionHttpStub.getActiveFocusSessionMeta);
            sinonExpect.calledOnce(timeSessionHttpStub.getActiveBreakSession);
            expect(result).toBeTruthy();
        });
    });

    describe('stopFocusSession', () => {
        test('should return false when failed to stop focus session', async() => {
            timeSessionHttpStub.stopFocusSession.resolves(false);

            const result = await timeSessionDispatch(store, TimeSessionAction.StopFocusSession, '1234');

            sinonExpect.calledOnce(timeSessionHttpStub.stopFocusSession);
            sinonExpect.notCalled(timeSessionHttpStub.getActiveFocusSessionMeta);
            sinonExpect.notCalled(timeSessionHttpStub.getActiveBreakSession);
            sinonExpect.notCalled(timeSessionHttpStub.getStaleFocusSessionMeta);
            sinonExpect.notCalled(timeSessionHttpStub.getStaleBreakSession);
            expect(result).toBeFalsy();
        });

        test('should return true when successfully stopped focus session', async() => {
            timeSessionHttpStub.stopFocusSession.resolves(true);

            const result = await timeSessionDispatch(store, TimeSessionAction.StopFocusSession, '1234');

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

            const result = await timeSessionDispatch(store, TimeSessionAction.StartBreakSession, option);

            sinonExpect.calledOnce(timeSessionHttpStub.startBreakSession);
            sinonExpect.notCalled(timeSessionHttpStub.getActiveFocusSessionMeta);
            sinonExpect.notCalled(timeSessionHttpStub.getActiveBreakSession);
            expect(result).toBeFalsy();
        });

        test('should return true when successfully started break session', async() => {
            const option = new BreakSessionStartupOption('1234', 5);
            timeSessionHttpStub.startBreakSession.resolves(true);

            const result = await timeSessionDispatch(store, TimeSessionAction.StartBreakSession, option);

            sinonExpect.calledOnce(timeSessionHttpStub.startBreakSession);
            sinonExpect.calledOnce(timeSessionHttpStub.getActiveFocusSessionMeta);
            sinonExpect.calledOnce(timeSessionHttpStub.getActiveBreakSession);
            expect(result).toBeTruthy();
        });
    });

    describe('stopBreakSession', () => {
        test('should return false when failed to stop break session', async() => {
            timeSessionHttpStub.stopBreakSession.resolves(false);

            const result = await timeSessionDispatch(store, TimeSessionAction.StopBreakSession, '1234');

            sinonExpect.calledOnce(timeSessionHttpStub.stopBreakSession);
            sinonExpect.notCalled(timeSessionHttpStub.getActiveFocusSessionMeta);
            sinonExpect.notCalled(timeSessionHttpStub.getActiveBreakSession);
            sinonExpect.notCalled(timeSessionHttpStub.getStaleFocusSessionMeta);
            sinonExpect.notCalled(timeSessionHttpStub.getStaleBreakSession);
            expect(result).toBeFalsy();
        });

        test('should return true when successfully stopped break session', async() => {
            timeSessionHttpStub.stopBreakSession.resolves(true);

            const result = await timeSessionDispatch(store, TimeSessionAction.StopBreakSession, '1234');

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
            expect(timeSessionGetters(store, TimeSessionGetter.ActiveFocusSession)).not.toEqual(focusSession);
            expect(timeSessionGetters(store, TimeSessionGetter.ActiveBreakSession)).not.toEqual(breakSession);

            await timeSessionDispatch(store, TimeSessionAction.LoadActiveTimeSession);

            sinonExpect.calledOnce(timeSessionHttpStub.getActiveFocusSessionMeta);
            sinonExpect.calledOnce(timeSessionHttpStub.getActiveBreakSession);
            expect(timeSessionGetters(store, TimeSessionGetter.ActiveFocusSession)).toEqual(focusSession);
            expect(timeSessionGetters(store, TimeSessionGetter.ActiveBreakSession)).toEqual(breakSession);
        });
    });

    describe('loadStaleTimeSession', () => {
        test('should load stale time sessions', async() => {
            const focusSession: FocusSessionDto = { ...new FocusSessionDto(), id: '1' };
            const breakSession: BreakSession = { ...new BreakSession(), id: '2' };
            timeSessionHttpStub.getStaleFocusSessionMeta.resolves(focusSession);
            timeSessionHttpStub.getStaleBreakSession.resolves(breakSession);
            expect(timeSessionGetters(store, TimeSessionGetter.StaleFocusSession)).not.toEqual(focusSession);
            expect(timeSessionGetters(store, TimeSessionGetter.StaleBreakSession)).not.toEqual(breakSession);

            await timeSessionDispatch(store, TimeSessionAction.LoadStaleTimeSession);

            sinonExpect.calledOnce(timeSessionHttpStub.getStaleFocusSessionMeta);
            sinonExpect.calledOnce(timeSessionHttpStub.getStaleBreakSession);
            expect(timeSessionGetters(store, TimeSessionGetter.StaleFocusSession)).toEqual(focusSession);
            expect(timeSessionGetters(store, TimeSessionGetter.StaleBreakSession)).toEqual(breakSession);
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
            timeSessionCommit(store, TimeSessionMutation.SetActiveFocusSession, session);
            timeSessionCommit(store, TimeSessionMutation.SetActiveBreakSession, null);

            await timeSessionDispatch(store, TimeSessionAction.SyncActiveTimeSession);

            sinonExpect.calledOnce(timeSessionHttpStub.getActiveFocusSessionMeta);
            sinonExpect.calledOnce(timeSessionHttpStub.getActiveBreakSession);
            sinonExpect.calledOnce(timeSessionHttpStub.getStaleFocusSessionMeta);
            sinonExpect.calledOnce(timeSessionHttpStub.getStaleBreakSession);
        });

        test('should sync focus session time', () => {
            const startTime = new Date().toISOString();
            const session: FocusSessionDto = { ...new FocusSessionDto(), startTime, targetDuration: 2 };

            timeSessionDispatch(store, TimeSessionAction.SyncActiveTimeSession);
            timeSessionCommit(store, TimeSessionMutation.SetActiveFocusSession, session);
            timeSessionCommit(store, TimeSessionMutation.SetActiveBreakSession, null);

            jest.advanceTimersByTime(1000);

            expect(timeSessionGetters(store, TimeSessionGetter.ActiveFocusSession)).toEqual(session);
        });

        test('should sync break session time', () => {
            const startTime = new Date().toISOString();
            const session: BreakSession = { ...new BreakSession(), id: '1', startTime, targetDuration: 2 };

            timeSessionDispatch(store, TimeSessionAction.SyncActiveTimeSession);
            timeSessionCommit(store, TimeSessionMutation.SetActiveFocusSession, null);
            timeSessionCommit(store, TimeSessionMutation.SetActiveBreakSession, session);

            jest.advanceTimersByTime(1000);

            expect(timeSessionGetters(store, TimeSessionGetter.ActiveBreakSession)).toEqual(session);
        });
    });
});
