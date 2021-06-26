import { Store } from 'vuex';
import { assert as sinonExpect, createStubInstance, SinonStubbedInstance } from 'sinon';

import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { WorkItemDto } from '../../core/dtos/work-item-dto';
import { FocusSessionDto } from '../../core/dtos/focus-session-dto';
import { ActivityBreakdownDto } from '../../core/dtos/activity-breakdown-dto';
import { BreakSession } from '../../core/models/time-session/break-session';
import { WorkItemStatus } from '../../core/enums/work-item-status.enum';
import { WorkItemType } from '../../core/enums/work-item-type.enum';
import { TimeSessionStatus } from '../../core/enums/time-session-status.enum';
import { TimeSessionHttpService } from '../../core/services/http/time-session-http/time-session-http.service'

import { ITimeSessionState, createStore } from './time-session.state';

describe('time session store unit test', () => {
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
            store.commit('setActiveBreakSession', { id: '1' } as BreakSession);

            expect(store.getters['timeSessionStatus']).toEqual(TimeSessionStatus.Resting);
        });

        test('should return correct status during focus session', () => {
            const session = new FocusSessionDto();
            store.commit('setActiveFocusSession', session);
            store.commit('setActiveBreakSession', null);

            session.workItems = [{ status: WorkItemStatus.Ongoing } as WorkItemDto];
            expect(store.getters['timeSessionStatus']).toEqual(TimeSessionStatus.Ongoing);

            session.workItems = [{ status: WorkItemStatus.Completed } as WorkItemDto];
            expect(store.getters['timeSessionStatus']).toEqual(TimeSessionStatus.Pending);
        });
    });

    describe('loadActiveTimeSession', () => {
        test('should load active time sessions', async() => {
            const focusSession = { id: '1' } as FocusSessionDto;
            const breakSession = { id: '2' } as BreakSession;
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

    describe('syncActiveTimeSession', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        test('should sync focus session time', () => {
            const oneHour = 60 * 60 * 1000;
            const workItem = { status: WorkItemStatus.Ongoing, type: WorkItemType.Regular } as WorkItemDto;
            const session = { workItems: [workItem], activities: new ActivityBreakdownDto() } as FocusSessionDto;
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
            const session = { id: '1' } as BreakSession;

            store.dispatch('syncActiveTimeSession');
            store.commit('setActiveFocusSession', null);
            store.commit('setActiveBreakSession', session);

            jest.advanceTimersByTime(1000);

            expect(store.getters['activeBreakSession']).toEqual(session);
        });
    });
});
