import { Store } from 'vuex';
import { assert as sinonExpect, createStubInstance, SinonStubbedInstance } from 'sinon';

import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { ProgressionCounter } from '../../core/models/generic/progression-counter';
import { TimeTrackingBreakdownDto } from '../../core/dtos/time-tracking-breakdown-dto';
import { ActivityBreakdownDto } from '../../core/dtos/activity-breakdown-dto';
import { EstimationBreakdownDto } from '../../core/dtos/estimation-breakdown-dto';
import { DueDateBreakdownDto } from '../../core/dtos/due-date-breakdown-dto';
import { PerformanceHttpService } from '../../core/services/http/performance-http/performance-http.service';

import { IPerformanceState, createStore } from './performance.state';

describe('performance store unit test', () => {
    let store: Store<IPerformanceState>;
    let performanceHttpStub: SinonStubbedInstance<PerformanceHttpService>;

    beforeEach(() => {
        performanceHttpStub = createStubInstance(PerformanceHttpService);

        container
            .rebind<PerformanceHttpService>(types.PerformanceHttpService)
            .toConstantValue(performanceHttpStub as unknown as PerformanceHttpService);

        store = new Store(createStore());
    });

    describe('dateRange', () => {
        test('should return correct date range', () => {
            const oneDay = 24 * 60 * 60 * 1000;

            const result = store.getters['dateRange'];

            expect(result.end.getTime() - result.start.getTime()).toEqual(14 * oneDay);
        });
    });

    describe('loadCurrentDayProgression', () => {
        test('should load current day progression', async() => {
            const progression: ProgressionCounter<number> = { current: 2, target: 3, isCompleted: false };
            performanceHttpStub.getDailyProgression.resolves(progression);
            expect(store.getters['currentDayProgression']).not.toEqual(progression);

            await store.dispatch('loadCurrentDayProgression');

            sinonExpect.calledOnce(performanceHttpStub.getDailyProgression);
            expect(store.getters['currentDayProgression']).toEqual(progression);
        });
    });

    describe('loadCurrentDayTimeTracking', () => {
        test('should load current day time tracking', async() => {
            const tracking: TimeTrackingBreakdownDto = { activityTime: 5, breakTime: 5, untrackedTime: 14 };
            performanceHttpStub.getDailyTimeTracking.resolves(tracking);
            expect(store.getters['currentDayTimeTracking']).not.toEqual(tracking);

            await store.dispatch('loadCurrentDayTimeTracking');

            sinonExpect.calledOnce(performanceHttpStub.getDailyTimeTracking);
            expect(store.getters['currentDayTimeTracking']).toEqual(tracking);
        });
    });

    describe('loadActivityBreakdown', () => {
        test('should load activity breakdown', async() => {
            const breakdown: ActivityBreakdownDto = { regular: 5, recurring: 2, overlearning: 2, interruption: 1 };
            performanceHttpStub.getActivityBreakdownByDateRange.resolves(breakdown);
            expect(store.getters['activityBreakdown']).not.toEqual(breakdown);

            await store.dispatch('loadActivityBreakdown');

            sinonExpect.calledOnce(performanceHttpStub.getActivityBreakdownByDateRange);
            expect(store.getters['activityBreakdown']).toEqual(breakdown);
        });
    });

    describe('loadActivityHistories', () => {
        test('should load activity histories', async() => {
            const histories: ActivityBreakdownDto[] = [{ regular: 5, recurring: 2, overlearning: 2, interruption: 1 }];
            performanceHttpStub.getActivityBreakdownByDays.resolves(histories);
            expect(store.getters['activityHistories']).not.toEqual(histories);

            await store.dispatch('loadActivityHistories');

            sinonExpect.calledOnce(performanceHttpStub.getActivityBreakdownByDays);
            expect(store.getters['activityHistories']).toEqual(histories);
        });
    });

    describe('loadEstimationBreakdown', () => {
        test('should load estimation breakdown', async() => {
            const breakdown: EstimationBreakdownDto = { underestimate: 1, overestimate: 1.2, normal: 2 };
            performanceHttpStub.getEstimationBreakdown.resolves(breakdown);
            expect(store.getters['estimationBreakdown']).not.toEqual(breakdown);

            await store.dispatch('loadEstimationBreakdown');

            sinonExpect.calledOnce(performanceHttpStub.getEstimationBreakdown);
            expect(store.getters['estimationBreakdown']).toEqual(breakdown);
        });
    });

    describe('loadDueDateBreakdown', () => {
        test('should load due date breakdown', async() => {
            const breakdown: DueDateBreakdownDto = { pastDue: 0, looming: 2 };
            performanceHttpStub.getDueDateBreakdown.resolves(breakdown);
            expect(store.getters['dueDateBreakdown']).not.toEqual(breakdown);

            await store.dispatch('loadDueDateBreakdown');

            sinonExpect.calledOnce(performanceHttpStub.getDueDateBreakdown);
            expect(store.getters['dueDateBreakdown']).toEqual(breakdown);
        });
    });
});
