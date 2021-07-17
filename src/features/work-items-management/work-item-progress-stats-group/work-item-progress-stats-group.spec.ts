import { shallowMount, VueWrapper } from '@vue/test-utils';
import { createStore, Store } from 'vuex';

import { UserMutation } from '../../../store/user/user.mutations';
import { createStore as createUserStore, userCommit, userKey } from '../../../store/user/user.store';
import { PerformanceMutation } from '../../../store/performance/performance.mutations';
import { createStore as createPerformanceStore, performanceCommit, performanceKey } from '../../../store/performance/performance.store';
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
            const breakdown: DueDateBreakdownDto = { pastDue: 2, looming: 3 };
            performanceCommit(store, PerformanceMutation.SetDueDateBreakdown, breakdown);

            expect(component.vm.pastDueAndLooming).toEqual('5');
        });
    });

    describe('pastDueAndLoomingSeries', () => {
        test('should return past due and looming item percentages', () => {
            const expected: PercentageSeries[] = [
                { percent: 40, colorType: 'context-colors-warning' },
                { percent: 60, colorType: 'context-colors-alert' }
            ];

            const breakdown: DueDateBreakdownDto = { pastDue: 2, looming: 3 };
            performanceCommit(store, PerformanceMutation.SetDueDateBreakdown, breakdown);

            expect(component.vm.pastDueAndLoomingSeries).toEqual(expected);
        });
    });

    describe('averageFocus', () => {
        test('should return average focus', () => {
            const histories: ActivityBreakdownDto[] = [
                { regular: 3, recurring: 1, overlearning: 1, interruption: 3 },
                { regular: 6, recurring: 0, overlearning: 1.5, interruption: 1 },
                { regular: 0, recurring: 0, overlearning: 0, interruption: 0 },
                { regular: 2.5, recurring: 3, overlearning: 0, interruption: 0 }
            ];

            performanceCommit(store, PerformanceMutation.SetActivityHistories, histories);

            expect(component.vm.averageFocus).toEqual('4.5 hours');
        });

        test('should handle plural for hours', () => {
            const histories: ActivityBreakdownDto[] = [
                { regular: 1, recurring: 1, overlearning: 1, interruption: 3 },
                { regular: 0, recurring: 0, overlearning: 0, interruption: 1 },
                { regular: 0, recurring: 0, overlearning: 0, interruption: 0 }
            ];

            performanceCommit(store, PerformanceMutation.SetActivityHistories, histories);

            expect(component.vm.averageFocus).toEqual('1 hour');
        });
    });

    describe('dailyFocusSeries', () => {
        test('should return correct daily focus breakdown', () => {
            const expected: PercentageSeries[] = [
                { percent: 25, colorType: 'context-colors-warning' },
                { percent: 25, colorType: 'context-colors-alert' }
            ];

            const histories: ActivityBreakdownDto[] = [
                { regular: 3, recurring: 3, overlearning: 1, interruption: 3 },
                { regular: 6, recurring: 6, overlearning: 0, interruption: 1 },
                { regular: 6, recurring: 3, overlearning: 2, interruption: 0 },
                { regular: 3, recurring: 3, overlearning: 2, interruption: 0 }
            ];

            performanceCommit(store, PerformanceMutation.SetActivityHistories, histories);

            expect(component.vm.dailyFocusSeries).toEqual(expected);
        });
    });

    describe('ratings', () => {
        test('should return default ratings when user rating is not available', () => {
            userCommit(store, UserMutation.SetProfile, null);

            expect(component.vm.ratings).toEqual(new PerformanceRating());
        });

        test('should return user ratings', () => {
            const ratings: PerformanceRating = {
                determination: 55,
                estimation: 65,
                planning: 80,
                adaptability: 60,
                sustainability: 40
            };

            userCommit(store, UserMutation.SetProfile, { ...new UserProfile(), ratings });

            expect(component.vm.ratings).toEqual(ratings);
        });
    });
});
