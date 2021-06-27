<template>
    <progress-bar :series="series"></progress-bar>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import { PercentageSeries } from '../../core/models/progress-bar/percentage-series';
import { ProgressionCounter } from '../../core/models/generic/progression-counter';
import ProgressBar from '../displays/progress-bar/progress-bar.vue';

class ItemCompletionProgressProp {
    public progress = prop<ProgressionCounter<number>>({ default: null });
}

@Options({
    components: { ProgressBar }
})
export default class ItemCompletionProgress extends Vue.with(ItemCompletionProgressProp) {

    get isOverestimate(): boolean {
        const { current, target } = this.progress;
        const exceedThreeHours = target - current > 3;
        const exceedSixtyPercent = (target - current) / target >= 0.6;

        return exceedThreeHours || (target > 0.5 && exceedSixtyPercent);
    }

    get series(): PercentageSeries[] {
        const prefix = 'progress-colors-';
        const { current, target, isCompleted } = this.progress;

        if (!target) {
            return [];
        }

        if (current > target) {
            const percent = target / current * 100;

            return [
                { percent, colorType: `${prefix}normal` },
                { percent: 100 - percent, colorType: `${prefix}underestimate` },
            ];
        }

        const percent = current / target * 100;
        const colorType = this.isOverestimate ? `${prefix}overestimate` : `${prefix}faster`;

        return [
            { percent, colorType: `${prefix}normal` },
            { percent: isCompleted ? 100 - percent : 0, colorType }
        ];
    }
}
</script>
