import axios from 'axios';
import { assert as sinonExpect, SinonStub, stub } from 'sinon';

import { types } from '../../../ioc/types';
import { container } from '../../../ioc/container';

import { PerformanceHttpService } from './performance-http.service';

describe('performance http service unit test', () => {
    let service: PerformanceHttpService;
    let getStub: SinonStub;

    beforeEach(() => {
        service = container.get<PerformanceHttpService>(types.PerformanceHttpService);
        getStub = stub(axios, 'get');
    });

    afterEach(() => {
        getStub.restore();
    });

    test('should resolve service', () => {
        expect(service).toBeTruthy();
    });

    describe('getDailyProgression', () => {
        test('should call correct endpoint', async() => {
            await service.getDailyProgression(2021, 5, 7);

            sinonExpect.calledOnceWithExactly(getStub, 'api/v1/performance/daily-progression/2021/5/7');
        });

        test('should return empty progression counter on error', async() => {
            getStub.throws(new Error());

            const result = await service.getDailyProgression(2021, 5, 7);

            expect(result.current).toEqual(0);
            expect(result.target).toEqual(8);
            expect(result.isCompleted).toBeFalsy();
        });
    });

    describe('getDailyTimeTracking', () => {
        test('should call correct endpoint', async() => {
            await service.getDailyTimeTracking(2021, 5, 7);

            sinonExpect.calledOnceWithExactly(getStub, 'api/v1/performance/daily-time-tracking/2021/5/7');
        });

        test('should return empty breakdown on error', async() => {
            getStub.throws(new Error());

            const result = await service.getDailyTimeTracking(2021, 5, 7);

            expect(result.activityTime).toEqual(0);
            expect(result.breakTime).toEqual(0);
            expect(result.untrackedTime).toEqual(24);
        });
    });

    describe('getActivityBreakdownByDateRange', () => {
        test('should call correct endpoint without date range', async() => {
            await service.getActivityBreakdownByDateRange();

            sinonExpect.calledOnceWithExactly(getStub, 'api/v1/performance/activity-breakdown');
        });

        test('should call correct endpoint with date range', async() => {
            const expected = 'api/v1/performance/activity-breakdown?start=2021-03-03T05:00:00.000Z&end=2021-03-07T05:00:00.000Z';

            await service.getActivityBreakdownByDateRange(new Date(2021, 2, 3), new Date(2021, 2, 7));

            sinonExpect.calledOnceWithExactly(getStub, expected);
        });

        test('should return empty breakdown on error', async() => {
            getStub.throws(new Error());

            const result = await service.getActivityBreakdownByDateRange();

            expect(result.regular).toEqual(0);
            expect(result.recurring).toEqual(0);
            expect(result.interruption).toEqual(0);
            expect(result.overlearning).toEqual(0);
        });
    });

    describe('getActivityBreakdownByDays', () => {
        test('should call correct endpoint', async() => {
            const expected = 'api/v1/performance/activity-breakdown/2021-03-03/2021-03-07';

            await service.getActivityBreakdownByDays(new Date(2021, 2, 3), new Date(2021, 2, 7));

            sinonExpect.calledOnceWithExactly(getStub, expected);
        });

        test('should return empty collection on error', async() => {
            getStub.throws(new Error());

            const result = await service.getActivityBreakdownByDays(new Date(2021, 2, 3), new Date(2021, 2, 7));

            expect(result.length).toEqual(0);
        });
    });

    describe('getEstimationBreakdown', () => {
        test('should call correct endpoint', async() => {
            const expected = 'api/v1/performance/estimation-breakdown?start=2021-03-03T05:00:00.000Z';

            await service.getEstimationBreakdown(new Date(2021, 2, 3));

            sinonExpect.calledOnceWithExactly(getStub, expected);
        });

        test('should return empty breakdown on error', async() => {
            getStub.throws(new Error());

            const result = await service.getEstimationBreakdown(new Date(2021, 2, 3));

            expect(result.normal).toEqual(0);
            expect(result.underestimate).toEqual(0);
            expect(result.overestimate).toEqual(0);
        });
    });

    describe('getDueDateBreakdown', () => {
        test('should call correct endpoint', async() => {
            const expected = 'api/v1/performance/due-date-breakdown?end=2021-03-03T05:00:00.000Z';

            await service.getDueDateBreakdown(undefined, new Date(2021, 2, 3));

            sinonExpect.calledOnceWithExactly(getStub, expected);
        });

        test('should return empty breakdown on error', async() => {
            getStub.throws(new Error());

            const result = await service.getDueDateBreakdown(undefined, new Date(2021, 2, 3));

            expect(result.pastDue).toEqual(0);
            expect(result.looming).toEqual(0);
        });
    });

    describe('getPerformanceRating', () => {
        test('should call correct endpoint', async() => {
            const expected = 'api/v1/performance/ratings?end=2021-03-03T05:00:00.000Z';

            await service.getPerformanceRating(undefined, new Date(2021, 2, 3));

            sinonExpect.calledOnceWithExactly(getStub, expected);
        });

        test('should return empty ratings on error', async() => {
            getStub.throws(new Error());

            const result = await service.getPerformanceRating(undefined, new Date(2021, 2, 3));

            expect(result.determination).toEqual(0);
            expect(result.estimation).toEqual(0);
            expect(result.planning).toEqual(0);
            expect(result.adaptability).toEqual(0);
            expect(result.sustainability).toEqual(0);
        });
    });
});
