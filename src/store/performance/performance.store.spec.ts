import { assert as sinonExpect, createStubInstance, SinonStubbedInstance } from 'sinon';

import { createStore } from '../../store';
import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { ProgressionCounter } from '../../core/models/generic/progression-counter';
import { TimeTrackingBreakdownDto } from '../../core/dtos/time-tracking-breakdown-dto';
import { ActivityBreakdownDto } from '../../core/dtos/activity-breakdown-dto';
import { EstimationBreakdownDto } from '../../core/dtos/estimation-breakdown-dto';
import { DueDateBreakdownDto } from '../../core/dtos/due-date-breakdown-dto';
import { PerformanceRating } from '../../core/models/user/performance-rating';
import { PerformanceHttpService } from '../../core/services/http/performance-http/performance-http.service';

describe('performance store unit test', () => {
    let store: ReturnType<typeof createStore>;
    let performanceHttpStub: SinonStubbedInstance<PerformanceHttpService>;

    beforeEach(() => {
        performanceHttpStub = createStubInstance(PerformanceHttpService);

        container
            .rebind<PerformanceHttpService>(types.PerformanceHttpService)
            .toConstantValue(performanceHttpStub as unknown as PerformanceHttpService);

        store = createStore();
    });

    describe('dateRange', () => {
        test('should return correct date range', () => {
            const oneDay = 24 * 60 * 60 * 1000;

            const result = store.performance.getters(store.store, store.performance.keys.getters.DateRange);

            expect(result.end.getTime() - result.start.getTime()).toEqual(14 * oneDay);
        });
    });

    describe('loadCurrentDayProgression', () => {
        test('should load current day progression', async() => {
            const progression: ProgressionCounter<number> = { current: 2, target: 3, isCompleted: false };
            performanceHttpStub.getDailyProgression.resolves(progression);
            expect(store.performance.getters(store.store, store.performance.keys.getters.CurrentDayProgression)).not.toEqual(progression);

            await store.performance.dispatch(store.store, store.performance.keys.actions.LoadCurrentDayProgression);

            sinonExpect.calledOnce(performanceHttpStub.getDailyProgression);
            expect(store.performance.getters(store.store, store.performance.keys.getters.CurrentDayProgression)).toEqual(progression);
        });
    });

    describe('loadCurrentDayTimeTracking', () => {
        test('should load current day time tracking', async() => {
            const tracking: TimeTrackingBreakdownDto = { activityTime: 5, breakTime: 5, untrackedTime: 14 };
            performanceHttpStub.getDailyTimeTracking.resolves(tracking);
            expect(store.performance.getters(store.store, store.performance.keys.getters.CurrentDayTimeTracking)).not.toEqual(tracking);

            await store.performance.dispatch(store.store, store.performance.keys.actions.LoadCurrentDayTimeTracking);

            sinonExpect.calledOnce(performanceHttpStub.getDailyTimeTracking);
            expect(store.performance.getters(store.store, store.performance.keys.getters.CurrentDayTimeTracking)).toEqual(tracking);
        });
    });

    describe('loadActivityBreakdown', () => {
        test('should load activity breakdown', async() => {
            const breakdown: ActivityBreakdownDto = { regular: 5, recurring: 2, overlearning: 2, interruption: 1 };
            performanceHttpStub.getActivityBreakdownByDateRange.resolves(breakdown);
            expect(store.performance.getters(store.store, store.performance.keys.getters.ActivityBreakdown)).not.toEqual(breakdown);

            await store.performance.dispatch(store.store, store.performance.keys.actions.LoadActivityBreakdown);

            sinonExpect.calledOnce(performanceHttpStub.getActivityBreakdownByDateRange);
            expect(store.performance.getters(store.store, store.performance.keys.getters.ActivityBreakdown)).toEqual(breakdown);
        });
    });

    describe('loadActivityHistories', () => {
        test('should load activity histories', async() => {
            const histories: ActivityBreakdownDto[] = [{ regular: 5, recurring: 2, overlearning: 2, interruption: 1 }];
            performanceHttpStub.getActivityBreakdownByDays.resolves(histories);
            expect(store.performance.getters(store.store, store.performance.keys.getters.ActivityHistories)).not.toEqual(histories);

            await store.performance.dispatch(store.store, store.performance.keys.actions.LoadActivityHistories);

            sinonExpect.calledOnce(performanceHttpStub.getActivityBreakdownByDays);
            expect(store.performance.getters(store.store, store.performance.keys.getters.ActivityHistories)).toEqual(histories);
        });
    });

    describe('loadEstimationBreakdown', () => {
        test('should load estimation breakdown', async() => {
            const breakdown: EstimationBreakdownDto = { underestimate: 1, overestimate: 1.2, normal: 2 };
            performanceHttpStub.getEstimationBreakdown.resolves(breakdown);
            expect(store.performance.getters(store.store, store.performance.keys.getters.EstimationBreakdown)).not.toEqual(breakdown);

            await store.performance.dispatch(store.store, store.performance.keys.actions.LoadEstimationBreakdown);

            sinonExpect.calledOnce(performanceHttpStub.getEstimationBreakdown);
            expect(store.performance.getters(store.store, store.performance.keys.getters.EstimationBreakdown)).toEqual(breakdown);
        });
    });

    describe('loadDueDateBreakdown', () => {
        test('should load due date breakdown', async() => {
            const breakdown: DueDateBreakdownDto = { pastDue: 0, looming: 2 };
            performanceHttpStub.getDueDateBreakdown.resolves(breakdown);
            expect(store.performance.getters(store.store, store.performance.keys.getters.DueDateBreakdown)).not.toEqual(breakdown);

            await store.performance.dispatch(store.store, store.performance.keys.actions.LoadDueDateBreakdown);

            sinonExpect.calledOnce(performanceHttpStub.getDueDateBreakdown);
            expect(store.performance.getters(store.store, store.performance.keys.getters.DueDateBreakdown)).toEqual(breakdown);
        });
    });

    describe('getPerformanceRating', () => {
        test('should load performance rating', async() => {
            const rating: PerformanceRating = { ...new PerformanceRating(), estimation: 0.65 };
            performanceHttpStub.getPerformanceRating.resolves(rating);

            expect(await store.performance.dispatch(store.store, store.performance.keys.actions.GetPerformanceRating)).toEqual(rating);
        });
    });
});
