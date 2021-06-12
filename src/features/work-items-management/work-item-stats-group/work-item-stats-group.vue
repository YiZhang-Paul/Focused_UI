<template>
    <div class="work-item-stats-group-container">
        <stats-breakdown v-if="activityBreakdown"
            class="breakdown"
            :title="'time tracked'"
            :content="timeTracked"
            :series="timeTrackedSeries">
        </stats-breakdown>

        <stats-breakdown v-if="estimationBreakdown"
            class="breakdown"
            :title="'inaccurate estimate'"
            :content="inaccurateEstimate"
            :series="inaccurateEstimateSeries">
        </stats-breakdown>

        <task-radar class="stats-graph" :series="radarSeries"></task-radar>

        <activity-history class="stats-graph"
            :dateRange="dateRange"
            :histories="activityHistories">
        </activity-history>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../../store';
import { performanceKey } from '../../../store/performance/performance.state';
import { workItemKey } from '../../../store/work-item/work-item.state';
import { WorkItemDto } from '../../../core/dtos/work-item-dto';
import { ActivityBreakdownDto } from '../../../core/dtos/activity-breakdown-dto';
import { EstimationBreakdownDto } from '../../../core/dtos/estimation-breakdown-dto';
import { DateRange } from '../../../core/models/generic/date-range';
import { RadarSeries } from '../../../core/models/generic/radar-series';
import { PercentageSeries } from '../../../core/models/progress-bar/percentage-series';
import StatsBreakdown from '../../../shared/widgets/stats-breakdown.vue';
import TaskRadar from '../../../shared/widgets/task-radar.vue';
import ActivityHistory from '../../../shared/widgets/activity-history.vue';

@Options({
    components: {
        StatsBreakdown,
        TaskRadar,
        ActivityHistory
    }
})
export default class WorkItemStatsGroup extends Vue {

    get dateRange(): DateRange {
        return store.getters[`${performanceKey}/dateRange`];
    }

    get activityBreakdown(): ActivityBreakdownDto | null {
        return store.getters[`${performanceKey}/activityBreakdown`];
    }

    get activityHistories(): ActivityBreakdownDto[] {
        return store.getters[`${performanceKey}/activityHistories`];
    }

    get timeTracked(): string {
        const { regular, recurring, interruption, overlearning } = this.activityBreakdown!;
        const days = (regular + recurring + interruption + overlearning) / 24;
        const total = days.toFixed(days === Math.trunc(days) ? 0 : 1);

        return `${total} / 14 days`;
    }

    get timeTrackedSeries(): PercentageSeries[] {
        const { regular, recurring, interruption, overlearning } = this.activityBreakdown!;
        const total = regular + recurring + interruption + overlearning;

        return [
            { percent: interruption / total * 100, colorType: 'activity-colors-interruption' },
            { percent: regular / total * 100, colorType: 'activity-colors-regular' },
            { percent: recurring / total * 100, colorType: 'activity-colors-recurring' },
            { percent: overlearning / total * 100, colorType: 'activity-colors-overlearning' }
        ];
    }

    get estimationBreakdown(): EstimationBreakdownDto | null {
        return store.getters[`${performanceKey}/estimationBreakdown`];
    }

    get inaccurateEstimate(): string {
        const { overestimate, underestimate } = this.estimationBreakdown!;
        const hours = overestimate + underestimate;
        const total = hours.toFixed(hours === Math.trunc(hours) ? 0 : 1);

        return `${total} hour${hours > 1 ? 's' : ''}`;
    }

    get inaccurateEstimateSeries(): PercentageSeries[] {
        const { normal, overestimate, underestimate } = this.estimationBreakdown!;
        const total = normal + overestimate + underestimate;

        return [
            { percent: normal / total * 100, colorType: 'progress-colors-normal' },
            { percent: overestimate / total * 100, colorType: 'progress-colors-overestimate' },
            { percent: underestimate / total * 100, colorType: 'progress-colors-underestimate' }
        ];
    }

    get radarSeries(): RadarSeries[] {
        const items: WorkItemDto[] = store.getters[`${workItemKey}/workItems`] ?? [];

        return items.filter(_ => !_.itemProgress.isCompleted).map(_ => ({
            quadrant: _.priority + 1,
            value: _.itemProgress.target,
            colorType: `priority-colors-${_.priority}`
        }));
    }
}
</script>

<style lang="scss" scoped>
.work-item-stats-group-container {

    .breakdown, .stats-graph {
        width: 100%;
    }

    .breakdown {
        height: 10.5%;
    }

    .stats-graph {
        height: 37%;
    }
}
</style>
