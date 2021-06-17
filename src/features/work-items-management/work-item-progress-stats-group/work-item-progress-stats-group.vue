<template>
    <div class="work-item-progress-stats-group-container">
        <stats-breakdown v-if="dueDateBreakdown"
            class="breakdown"
            :title="'past due/looming'"
            :content="pastDueAndLooming"
            :series="pastDueAndLoomingSeries">
        </stats-breakdown>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../../store';
import { performanceKey } from '../../../store/performance/performance.state';
import { DueDateBreakdownDto } from '../../../core/dtos/due-date-breakdown-dto';
import { PercentageSeries } from '../../../core/models/progress-bar/percentage-series';
import StatsBreakdown from '../../../shared/widgets/stats-breakdown.vue';

@Options({
    components: {
        StatsBreakdown
    }
})
export default class WorkItemProgressStatsGroup extends Vue {

    get dueDateBreakdown(): DueDateBreakdownDto | null {
        return store.getters[`${performanceKey}/dueDateBreakdown`];
    }

    get pastDueAndLooming(): string {
        const { pastDue, looming } = this.dueDateBreakdown!;

        return `${pastDue + looming}`;
    }

    get pastDueAndLoomingSeries(): PercentageSeries[] {
        const { pastDue, looming } = this.dueDateBreakdown!;
        const total = pastDue + looming;

        return [
            { percent: pastDue / total * 100, colorType: 'context-colors-warning' },
            { percent: looming / total * 100, colorType: 'context-colors-alert' }
        ];
    }
}
</script>

<style lang="scss" scoped>
.work-item-progress-stats-group-container {

    .breakdown {
        width: 100%;
        height: 10.5%;
    }
}
</style>
