<template>
    <div class="work-item-progress-stats-group-container">
        <stats-breakdown v-if="dueDateBreakdown"
            class="breakdown"
            :title="'past due/looming'"
            :content="pastDueAndLooming"
            :series="pastDueAndLoomingSeries">
        </stats-breakdown>

        <stats-breakdown v-if="activityHistories"
            class="breakdown"
            :title="'average daily focus'"
            :content="averageFocus"
            :series="dailyFocusSeries">
        </stats-breakdown>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../../store';
import { performanceKey } from '../../../store/performance/performance.state';
import { DueDateBreakdownDto } from '../../../core/dtos/due-date-breakdown-dto';
import { ActivityBreakdownDto } from '../../../core/dtos/activity-breakdown-dto';
import { PercentageSeries } from '../../../core/models/progress-bar/percentage-series';
import { GenericUtility } from '../../../core/utilities/generic-utility/generic-utility';
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

    get activityHistories(): ActivityBreakdownDto[] {
        return store.getters[`${performanceKey}/activityHistories`] ?? [];
    }

    get averageFocus(): string {
        const hours = this.activityHistories.reduce((total, _) => total + _.regular + _.recurring + _.overlearning, 0);
        const average = GenericUtility.roundTo(hours / this.activityHistories.length, 1);

        return `${average} hour${average > 1 ? 's' : ''}`;
    }

    get dailyFocusSeries(): PercentageSeries[] {
        const total = this.activityHistories.length;
        const aggregate = { insufficient: 0, sufficient: 0, overdoing: 0 };

        const { insufficient, sufficient, overdoing } = this.activityHistories.reduce((_, history) => {
            const focus = history.regular + history.recurring + history.overlearning;

            if (focus < 8) {
                return { ..._, insufficient: _.insufficient + 1 };
            }

            if (focus < 12) {
                return { ..._, sufficient: _.sufficient + 1 };
            }

            return { ..._, overdoing: _.overdoing + 1 };
        }, aggregate);

        return [
            { percent: overdoing / total * 100, colorType: 'focus-progress-colors-overdoing' },
            { percent: insufficient / total * 100, colorType: 'focus-progress-colors-insufficient' },
            { percent: sufficient / total * 100, colorType: 'focus-progress-colors-sufficient' }
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
