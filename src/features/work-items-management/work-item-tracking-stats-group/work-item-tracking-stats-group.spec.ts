import { shallowMount, VueWrapper } from '@vue/test-utils';
import { createStore, Store } from 'vuex';

import { PerformanceMutation } from '../../../store/performance/performance.mutations';
import { createStore as createPerformanceStore, performanceCommit, performanceKey } from '../../../store/performance/performance.store';
import { WorkItemMutation } from '../../../store/work-item/work-item.mutations';
import { createStore as createWorkItemStore, workItemCommit, workItemKey } from '../../../store/work-item/work-item.store';
import { WorkItemDto } from '../../../core/dtos/work-item-dto';
import { ActivityBreakdownDto } from '../../../core/dtos/activity-breakdown-dto';
import { EstimationBreakdownDto } from '../../../core/dtos/estimation-breakdown-dto';
import { RadarSeries } from '../../../core/models/generic/radar-series';
import { PercentageSeries } from '../../../core/models/progress-bar/percentage-series';
import { WorkItemPriority } from '../../../core/enums/work-item-priority.enum';

import WorkItemTrackingStatsGroup from './work-item-tracking-stats-group.vue';

describe('work item tracking stats group unit test', () => {
    let component: VueWrapper<any>;
    let store: Store<any>;

    beforeEach(() => {
        store = createStore({
            modules: {
                [performanceKey]: createPerformanceStore(),
                [workItemKey]: createWorkItemStore()
            }
        });

        component = shallowMount(WorkItemTrackingStatsGroup, { global: { mocks: { $store: store } } });
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('timeTracked', () => {
        test('should return total time tracked', () => {
            const breakdown: ActivityBreakdownDto = { regular: 15, recurring: 10, interruption: 8, overlearning: 10 };
            performanceCommit(store, PerformanceMutation.SetActivityBreakdown, breakdown);

            expect(component.vm.timeTracked).toEqual('1.8 / 14 days');
        });
    });

    describe('timeTrackedSeries', () => {
        test('should return time tracked percentages', () => {
            const expected: PercentageSeries[] = [
                { percent: 10, colorType: 'activity-colors-interruption' },
                { percent: 50, colorType: 'activity-colors-regular' },
                { percent: 20, colorType: 'activity-colors-overlearning' },
                { percent: 20, colorType: 'activity-colors-recurring' }
            ];

            const breakdown: ActivityBreakdownDto = { regular: 25, recurring: 10, interruption: 5, overlearning: 10 };
            performanceCommit(store, PerformanceMutation.SetActivityBreakdown, breakdown);

            expect(component.vm.timeTrackedSeries).toEqual(expected);
        });
    });

    describe('inaccurateEstimate', () => {
        test('should return inaccurate estimations', () => {
            const breakdown: EstimationBreakdownDto = { normal: 10, overestimate: 0.5, underestimate: 0.5 };
            performanceCommit(store, PerformanceMutation.SetEstimationBreakdown, breakdown);

            expect(component.vm.inaccurateEstimate).toEqual('1 hour');
        });

        test('should handle plural for hours', () => {
            const breakdown: EstimationBreakdownDto = { normal: 10, overestimate: 4, underestimate: 6 };
            performanceCommit(store, PerformanceMutation.SetEstimationBreakdown, breakdown);

            expect(component.vm.inaccurateEstimate).toEqual('10 hours');
        });
    });

    describe('inaccurateEstimateSeries', () => {
        test('should return inaccurate estimation percentages', () => {
            const expected: PercentageSeries[] = [
                { percent: 30, colorType: 'context-colors-warning' },
                { percent: 20, colorType: 'context-colors-alert' }
            ];

            const breakdown: EstimationBreakdownDto = { normal: 10, overestimate: 4, underestimate: 6 };
            performanceCommit(store, PerformanceMutation.SetEstimationBreakdown, breakdown);

            expect(component.vm.inaccurateEstimateSeries).toEqual(expected);
        });
    });

    describe('radarSeries', () => {
        test('should return work item distribution information', () => {
            const items: WorkItemDto[] = [
                {
                    ...new WorkItemDto(),
                    priority: WorkItemPriority.UrgentNotImportant,
                    itemProgress: { current: 2, target: 2, isCompleted: false }
                },
                {
                    ...new WorkItemDto(),
                    priority: WorkItemPriority.ImportantNotUrgent,
                    itemProgress: { current: 2, target: 3, isCompleted: false }
                },
                {
                    ...new WorkItemDto(),
                    priority: WorkItemPriority.NotUrgentNotImportant,
                    itemProgress: { current: 2, target: 5, isCompleted: true }
                },
                {
                    ...new WorkItemDto(),
                    priority: WorkItemPriority.NotUrgentNotImportant,
                    itemProgress: { current: 2, target: 7, isCompleted: false }
                },
                {
                    ...new WorkItemDto(),
                    priority: WorkItemPriority.UrgentImportant,
                    itemProgress: { current: 2, target: 9, isCompleted: false }
                }
            ];

            const expected: RadarSeries[] = [
                { quadrant: 1, value: 9, colorType: 'priority-colors-0' },
                { quadrant: 2, value: 3, colorType: 'priority-colors-1' },
                { quadrant: 3, value: 2, colorType: 'priority-colors-2' },
                { quadrant: 4, value: 7, colorType: 'priority-colors-3' }
            ];

            workItemCommit(store, WorkItemMutation.SetWorkItems, items);

            expect(component.vm.radarSeries).toEqual(expected);
        });
    });
});
