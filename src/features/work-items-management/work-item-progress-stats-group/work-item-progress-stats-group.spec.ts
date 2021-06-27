import { shallowMount, VueWrapper } from '@vue/test-utils';
import { createStore, Store } from 'vuex';

import { createStore as createUserStore, userKey } from '../../../store/user/user.state';
import { createStore as createPerformanceStore, performanceKey } from '../../../store/performance/performance.state';
import { DueDateBreakdownDto } from '../../../core/dtos/due-date-breakdown-dto';
import { ActivityBreakdownDto } from '../../../core/dtos/activity-breakdown-dto';
import { PercentageSeries } from '../../../core/models/progress-bar/percentage-series';
import { UserProfile } from '../../../core/models/user/user-profile';
import { PerformanceRating } from '../../../core/models/user/performance-rating';

import WorkItemProgressStatsGroup from './work-item-progress-stats-group.vue';

describe('work item progress stats group unit test', () => {
    let component: VueWrapper<any>;
    let store: Store<any>;

    beforeEach(() => {
        store = createStore({
            modules: {
                [userKey]: createUserStore(),
                [performanceKey]: createPerformanceStore()
            }
        });

        component = shallowMount(WorkItemProgressStatsGroup, { global: { mocks: { $store: store } } });
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('pastDueAndLooming', () => {
        test('should return total past due and looming items', () => {
            const breakdown = { pastDue: 2, looming: 3 } as DueDateBreakdownDto;
            store.commit(`${performanceKey}/setDueDateBreakdown`, breakdown);

            expect(component.vm.pastDueAndLooming).toEqual('5');
        });
    });

    describe('pastDueAndLoomingSeries', () => {
        test('should return past due and looming item percentages', () => {
            const expected = [
                { percent: 40, colorType: 'context-colors-warning' } as PercentageSeries,
                { percent: 60, colorType: 'context-colors-alert' } as PercentageSeries
            ];

            const breakdown = { pastDue: 2, looming: 3 } as DueDateBreakdownDto;
            store.commit(`${performanceKey}/setDueDateBreakdown`, breakdown);

            expect(component.vm.pastDueAndLoomingSeries).toEqual(expected);
        });
    });

    describe('averageFocus', () => {
        test('should return average focus', () => {
            const histories = [
                { regular: 3, recurring: 1, overlearning: 1, interruption: 3 } as ActivityBreakdownDto,
                { regular: 6, recurring: 0, overlearning: 1.5, interruption: 1 } as ActivityBreakdownDto,
                { regular: 0, recurring: 0, overlearning: 0, interruption: 0 } as ActivityBreakdownDto,
                { regular: 2.5, recurring: 3, overlearning: 0, interruption: 0 } as ActivityBreakdownDto
            ];

            store.commit(`${performanceKey}/setActivityHistories`, histories);

            expect(component.vm.averageFocus).toEqual('4.5 hours');
        });

        test('should handle plural for hours', () => {
            const histories = [
                { regular: 1, recurring: 1, overlearning: 1, interruption: 3 } as ActivityBreakdownDto,
                { regular: 0, recurring: 0, overlearning: 0, interruption: 1 } as ActivityBreakdownDto,
                { regular: 0, recurring: 0, overlearning: 0, interruption: 0 } as ActivityBreakdownDto
            ];

            store.commit(`${performanceKey}/setActivityHistories`, histories);

            expect(component.vm.averageFocus).toEqual('1 hour');
        });
    });

    describe('dailyFocusSeries', () => {
        test('should return correct daily focus breakdown', () => {
            const expected = [
                { percent: 25, colorType: 'focus-progress-colors-overdoing' } as PercentageSeries,
                { percent: 25, colorType: 'focus-progress-colors-insufficient' } as PercentageSeries,
                { percent: 50, colorType: 'focus-progress-colors-sufficient' } as PercentageSeries
            ];

            const histories = [
                { regular: 3, recurring: 3, overlearning: 1, interruption: 3 } as ActivityBreakdownDto,
                { regular: 6, recurring: 6, overlearning: 0, interruption: 1 } as ActivityBreakdownDto,
                { regular: 6, recurring: 3, overlearning: 2, interruption: 0 } as ActivityBreakdownDto,
                { regular: 3, recurring: 3, overlearning: 2, interruption: 0 } as ActivityBreakdownDto
            ];

            store.commit(`${performanceKey}/setActivityHistories`, histories);

            expect(component.vm.dailyFocusSeries).toEqual(expected);
        });
    });

    describe('ratings', () => {
        test('should return default ratings when user rating is not available', () => {
            store.commit(`${userKey}/setProfile`, null);

            expect(component.vm.ratings).toEqual(new PerformanceRating());
        });

        test('should return user ratings', () => {
            const ratings = {
                determination: 55,
                estimation: 65,
                planning: 80,
                adaptability: 60,
                sustainability: 40
            } as PerformanceRating;

            store.commit(`${userKey}/setProfile`, { ratings } as UserProfile);

            expect(component.vm.ratings).toEqual(ratings);
        });
    });
});
