import { createStore, Store } from 'vuex';
import { assert as sinonExpect, createStubInstance, SinonStubbedInstance } from 'sinon';

import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { ProgressionCounter } from '../../core/models/generic/progression-counter';
import { TimeTrackingBreakdownDto } from '../../core/dtos/time-tracking-breakdown-dto';
import { ActivityBreakdownDto } from '../../core/dtos/activity-breakdown-dto';
import { EstimationBreakdownDto } from '../../core/dtos/estimation-breakdown-dto';
import { DueDateBreakdownDto } from '../../core/dtos/due-date-breakdown-dto';
import { PerformanceRating } from '../../core/models/user/performance-rating';
import { PerformanceHttpService } from '../../core/services/http/performance-http/performance-http.service';

import { IPerformanceState } from './performance.state';
import { PerformanceGetter } from './performance.getters';
import { PerformanceAction } from './performance.actions';
import { createStore as createPerformanceStore, performanceDispatch, performanceGetters, performanceKey } from './performance.store';

describe('performance store unit test', () => {
    let store: Store<IPerformanceState>;
    let performanceHttpStub: SinonStubbedInstance<PerformanceHttpService>;

    beforeEach(() => {
        performanceHttpStub = createStubInstance(PerformanceHttpService);

        container
            .rebind<PerformanceHttpService>(types.PerformanceHttpService)
            .toConstantValue(performanceHttpStub as unknown as PerformanceHttpService);

        store = createStore({ modules: { [performanceKey]: createPerformanceStore() } });
    });

    describe('dateRange', () => {
        test('should return correct date range', () => {
            const oneDay = 24 * 60 * 60 * 1000;

            const result = performanceGetters(store, PerformanceGetter.DateRange);

            expect(result.end.getTime() - result.start.getTime()).toEqual(14 * oneDay);
        });
    });

    describe('loadCurrentDayProgression', () => {
        test('should load current day progression', async() => {
            const progression: ProgressionCounter<number> = { current: 2, target: 3, isCompleted: false };
            performanceHttpStub.getDailyProgression.resolves(progression);
            expect(performanceGetters(store, PerformanceGetter.CurrentDayProgression)).not.toEqual(progression);

            await performanceDispatch(store, PerformanceAction.LoadCurrentDayProgression);

            sinonExpect.calledOnce(performanceHttpStub.getDailyProgression);
            expect(performanceGetters(store, PerformanceGetter.CurrentDayProgression)).toEqual(progression);
        });
    });

    describe('loadCurrentDayTimeTracking', () => {
        test('should load current day time tracking', async() => {
            const tracking: TimeTrackingBreakdownDto = { activityTime: 5, breakTime: 5, untrackedTime: 14 };
            performanceHttpStub.getDailyTimeTracking.resolves(tracking);
            expect(performanceGetters(store, PerformanceGetter.CurrentDayTimeTracking)).not.toEqual(tracking);

            await performanceDispatch(store, PerformanceAction.LoadCurrentDayTimeTracking);

            sinonExpect.calledOnce(performanceHttpStub.getDailyTimeTracking);
            expect(performanceGetters(store, PerformanceGetter.CurrentDayTimeTracking)).toEqual(tracking);
        });
    });

    describe('loadActivityBreakdown', () => {
        test('should load activity breakdown', async() => {
            const breakdown: ActivityBreakdownDto = { regular: 5, recurring: 2, overlearning: 2, interruption: 1 };
            performanceHttpStub.getActivityBreakdownByDateRange.resolves(breakdown);
            expect(performanceGetters(store, PerformanceGetter.ActivityBreakdown)).not.toEqual(breakdown);

            await performanceDispatch(store, PerformanceAction.LoadActivityBreakdown);

            sinonExpect.calledOnce(performanceHttpStub.getActivityBreakdownByDateRange);
            expect(performanceGetters(store, PerformanceGetter.ActivityBreakdown)).toEqual(breakdown);
        });
    });

    describe('loadActivityHistories', () => {
        test('should load activity histories', async() => {
            const histories: ActivityBreakdownDto[] = [{ regular: 5, recurring: 2, overlearning: 2, interruption: 1 }];
            performanceHttpStub.getActivityBreakdownByDays.resolves(histories);
            expect(performanceGetters(store, PerformanceGetter.ActivityHistories)).not.toEqual(histories);

            await performanceDispatch(store, PerformanceAction.LoadActivityHistories);

            sinonExpect.calledOnce(performanceHttpStub.getActivityBreakdownByDays);
            expect(performanceGetters(store, PerformanceGetter.ActivityHistories)).toEqual(histories);
        });
    });

    describe('loadEstimationBreakdown', () => {
        test('should load estimation breakdown', async() => {
            const breakdown: EstimationBreakdownDto = { underestimate: 1, overestimate: 1.2, normal: 2 };
            performanceHttpStub.getEstimationBreakdown.resolves(breakdown);
            expect(performanceGetters(store, PerformanceGetter.EstimationBreakdown)).not.toEqual(breakdown);

            await performanceDispatch(store, PerformanceAction.LoadEstimationBreakdown);

            sinonExpect.calledOnce(performanceHttpStub.getEstimationBreakdown);
            expect(performanceGetters(store, PerformanceGetter.EstimationBreakdown)).toEqual(breakdown);
        });
    });

    describe('loadDueDateBreakdown', () => {
        test('should load due date breakdown', async() => {
            const breakdown: DueDateBreakdownDto = { pastDue: 0, looming: 2 };
            performanceHttpStub.getDueDateBreakdown.resolves(breakdown);
            expect(performanceGetters(store, PerformanceGetter.DueDateBreakdown)).not.toEqual(breakdown);

            await performanceDispatch(store, PerformanceAction.LoadDueDateBreakdown);

            sinonExpect.calledOnce(performanceHttpStub.getDueDateBreakdown);
            expect(performanceGetters(store, PerformanceGetter.DueDateBreakdown)).toEqual(breakdown);
        });
    });

    describe('getPerformanceRating', () => {
        test('should load performance rating', async() => {
            const rating: PerformanceRating = { ...new PerformanceRating(), estimation: 0.65 };
            performanceHttpStub.getPerformanceRating.resolves(rating);

            expect(await performanceDispatch(store, PerformanceAction.GetPerformanceRating)).toEqual(rating);
        });
    });
});
