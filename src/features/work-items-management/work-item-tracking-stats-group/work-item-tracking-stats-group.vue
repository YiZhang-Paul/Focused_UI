<template>
    <div class="work-item-tracking-stats-group-container">
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
import { ActivityBreakdownDto } from '../../../core/dtos/activity-breakdown-dto';
import { EstimationBreakdownDto } from '../../../core/dtos/estimation-breakdown-dto';
import { DateRange } from '../../../core/models/generic/date-range';
import { RadarSeries } from '../../../core/models/generic/radar-series';
import { PercentageSeries } from '../../../core/models/progress-bar/percentage-series';
import { GenericUtility } from '../../../core/utilities/generic-utility/generic-utility';
import StatsBreakdown from '../../../shared/widgets/stats-breakdown/stats-breakdown.vue';
import TaskRadar from '../../../shared/widgets/task-radar/task-radar.vue';
import ActivityHistory from '../../../shared/widgets/activity-history/activity-history.vue';

@Options({
    components: {
        StatsBreakdown,
        TaskRadar,
        ActivityHistory
    }
})
export default class WorkItemTrackingStatsGroup extends Vue {

    get dateRange(): DateRange {
        return store.performance.getters(store.performance.getter.DateRange);
    }

    get activityBreakdown(): ActivityBreakdownDto | null {
        return store.performance.getters(store.performance.getter.ActivityBreakdown);
    }

    get activityHistories(): ActivityBreakdownDto[] {
        return store.performance.getters(store.performance.getter.ActivityHistories);
    }

    get timeTracked(): string {
        const { regular, recurring, interruption, overlearning } = this.activityBreakdown!;
        const days = (regular + recurring + interruption + overlearning) / 24;

        return `${GenericUtility.roundTo(days, 1)} / 14 days`;
    }

    get timeTrackedSeries(): PercentageSeries[] {
        const { regular, recurring, interruption, overlearning } = this.activityBreakdown!;
        const total = regular + recurring + interruption + overlearning;

        return [
            new PercentageSeries(interruption / total * 100, 'activity-colors-interruption'),
            new PercentageSeries(regular / total * 100, 'activity-colors-regular'),
            new PercentageSeries(overlearning / total * 100, 'activity-colors-overlearning'),
            new PercentageSeries(recurring / total * 100, 'activity-colors-recurring')
        ];
    }

    get estimationBreakdown(): EstimationBreakdownDto | null {
        return store.performance.getters(store.performance.getter.EstimationBreakdown);
    }

    get inaccurateEstimate(): string {
        const { overestimate, underestimate } = this.estimationBreakdown!;
        const hours = GenericUtility.roundTo(overestimate + underestimate, 1);

        return `${hours} hour${hours > 1 ? 's' : ''}`;
    }

    get inaccurateEstimateSeries(): PercentageSeries[] {
        const { normal, overestimate, underestimate } = this.estimationBreakdown!;
        const total = normal + overestimate + underestimate;

        return [
            new PercentageSeries(underestimate / total * 100, 'context-colors-warning'),
            new PercentageSeries(overestimate / total * 100, 'context-colors-alert')
        ];
    }

    get radarSeries(): RadarSeries[] {
        const items = store.workItem.getters(store.workItem.getter.WorkItems);

        return items.filter(_ => !_.itemProgress.isCompleted).map(_ => ({
            quadrant: _.priority + 1,
            value: _.itemProgress.target,
            colorType: `priority-colors-${_.priority}`
        }));
    }
}
</script>

<style lang="scss" scoped>
.work-item-tracking-stats-group-container {

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
