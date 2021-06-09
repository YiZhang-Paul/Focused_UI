<template>
    <div class="work-item-stats-group">
        <stats-breakdown v-if="activityBreakdown"
            class="breakdown"
            :title="'time tracked'"
            :content="timeTracked"
            :series="timeTrackedSeries">
        </stats-breakdown>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../../store';
import { performanceKey } from '../../../store/performance/performance.state';
import { ActivityBreakdownDto } from '../../../core/dtos/activity-breakdown-dto';
import { PercentageSeries } from '../../../core/models/progress-bar/percentage-series';
import StatsBreakdown from '../../../shared/widgets/stats-breakdown.vue';

@Options({
    components: {
        StatsBreakdown
    }
})
export default class WorkItemStatsGroup extends Vue {

    get activityBreakdown(): ActivityBreakdownDto | null {
        return store.getters[`${performanceKey}/activityBreakdown`];
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
}
</script>

<style lang="scss" scoped>
.work-item-stats-group {

    .breakdown {
        width: 100%;
        height: 13.5%;
    }
}
</style>
