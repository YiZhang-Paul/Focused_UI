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

        <time-tracking-breakdown class="stats-graph" :tracking="timeTracking"></time-tracking-breakdown>
        <user-ratings-tracker class="stats-graph" :ratings="ratings"></user-ratings-tracker>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import { userKey } from '../../../store/user/user.state';
import { performanceKey } from '../../../store/performance/performance.state';
import { DueDateBreakdownDto } from '../../../core/dtos/due-date-breakdown-dto';
import { ActivityBreakdownDto } from '../../../core/dtos/activity-breakdown-dto';
import { TimeTrackingBreakdownDto } from '../../../core/dtos/time-tracking-breakdown-dto';
import { UserProfile } from '../../../core/models/user/user-profile';
import { PerformanceRating } from '../../../core/models/user/performance-rating';
import { PercentageSeries } from '../../../core/models/progress-bar/percentage-series';
import { GenericUtility } from '../../../core/utilities/generic-utility/generic-utility';
import StatsBreakdown from '../../../shared/widgets/stats-breakdown/stats-breakdown.vue';
import TimeTrackingBreakdown from '../../../shared/widgets/time-tracking-breakdown/time-tracking-breakdown.vue';
import UserRatingsTracker from '../../../shared/widgets/user-ratings-tracker/user-ratings-tracker.vue';

@Options({
    components: {
        StatsBreakdown,
        TimeTrackingBreakdown,
        UserRatingsTracker
    }
})
export default class WorkItemProgressStatsGroup extends Vue {

    get dueDateBreakdown(): DueDateBreakdownDto | null {
        return this.$store.getters[`${performanceKey}/dueDateBreakdown`];
    }

    get pastDueAndLooming(): string {
        const { pastDue, looming } = this.dueDateBreakdown!;

        return `${pastDue + looming}`;
    }

    get pastDueAndLoomingSeries(): PercentageSeries[] {
        const { pastDue, looming } = this.dueDateBreakdown!;
        const total = pastDue + looming;

        return [
            new PercentageSeries(pastDue / total * 100, 'context-colors-warning'),
            new PercentageSeries(looming / total * 100, 'context-colors-alert')
        ];
    }

    get activityHistories(): ActivityBreakdownDto[] {
        return this.$store.getters[`${performanceKey}/activityHistories`] ?? [];
    }

    get averageFocus(): string {
        const hours = GenericUtility.sum(this.activityHistories, _ => _.regular + _.recurring + _.overlearning);
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
            new PercentageSeries(overdoing / total * 100, 'focus-progress-colors-overdoing'),
            new PercentageSeries(insufficient / total * 100, 'focus-progress-colors-insufficient'),
            new PercentageSeries(sufficient / total * 100, 'focus-progress-colors-sufficient')
        ];
    }

    get timeTracking(): TimeTrackingBreakdownDto | null {
        return this.$store.getters[`${performanceKey}/currentDayTimeTracking`];
    }

    get ratings(): PerformanceRating {
        const user = this.$store.getters[`${userKey}/profile`] as UserProfile;

        return user?.ratings ?? new PerformanceRating();
    }
}
</script>

<style lang="scss" scoped>
.work-item-progress-stats-group-container {

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
