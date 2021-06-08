<template>
    <progress-bar :series="series"></progress-bar>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import { PercentageSeries } from '../../core/models/progress-bar/percentage-series';
import { ProgressionCounter } from '../../core/models/generic/progression-counter';
import ProgressBar from '../displays/progress-bar.vue';

class ItemCompletionProgressProp {
    public progress = prop<ProgressionCounter<number>>({ default: null });
}

@Options({
    components: { ProgressBar }
})
export default class ItemCompletionProgress extends Vue.with(ItemCompletionProgressProp) {

    get isWarning(): boolean {
        const { current, target } = this.progress;
        const exceedThreeHours = target - current > 3;
        const exceedSixtyPercent = (target - current) / target >= 0.6;

        return exceedThreeHours || (target > 0.5 && exceedSixtyPercent);
    }

    get series(): PercentageSeries[] {
        const { current, target, isCompleted } = this.progress;

        if (!target) {
            return [];
        }

        if (current > target) {
            return [
                { percent: target / current * 100, color: 'var(--progression-colors-000)' },
                { percent: (current - target) / current * 100, color: 'var(--progression-colors-400)' },
            ];
        }

        const color = this.isWarning ? 'var(--progression-colors-300)' : 'var(--progression-colors-200)';

        return [
            { percent: current / target * 100, color: 'var(--progression-colors-000)' },
            { percent: isCompleted ? (target - current) / target * 100 : 0, color }
        ];
    }
}
</script>
