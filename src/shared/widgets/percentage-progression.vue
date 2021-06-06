<template>
    <div class="percentage-progression-container">
        <div v-for="i in totalBlocks" :key="i" :class="getClasses(i)"></div>
    </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';

import { ProgressionCounter } from '../../core/models/generic/progression-counter';

class PercentageProgressionProp {
    public progress = prop<ProgressionCounter<number>>({ default: null });
}

export default class PercentageProgression extends Vue.with(PercentageProgressionProp) {
    public readonly totalBlocks = 27;

    get isWarning(): boolean {
        const { current, target } = this.progress;
        const exceedThreeHours = target - current > 3;
        const exceedSixtyPercent = (target - current) / target >= 0.6;

        return exceedThreeHours || (target > 0.5 && exceedSixtyPercent);
    }

    public getClasses(index: number): { [key: string]: boolean } | null {
        const { current, target, isCompleted } = this.progress;

        if (!target) {
            return null;
        }

        if (current > target) {
            const normalCount = Math.round(this.totalBlocks / current * target);

            return {
                normal: index <= normalCount,
                pastdue: index > normalCount
            };
        }

        const normalCount = Math.round(this.totalBlocks / target * current);

        return {
            normal: index <= normalCount,
            faster: isCompleted && !this.isWarning ? index > normalCount : false,
            warning: isCompleted && this.isWarning ? index > normalCount : false
        };
    }
}
</script>

<style lang="scss" scoped>
.percentage-progression-container {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background-color: var(--primary-colors-001);

    & > div {
        $total-blocks: 27;
        $block-gap: 4px;
        $side-gap: 5px;
        $width: calc((100% - #{$side-gap} - (#{$total-blocks} - 3) * #{$block-gap}) / (#{$total-blocks} - 2));

        min-width: $width;
        width: $width;
        height: 150%;
        transform: rotateZ(25deg);
        transition: background-color 0.3s;

        &:not(:first-of-type) {
            margin-left: $block-gap;
        }

        &.normal {
            background-color: var(--progression-colors-000);
            box-shadow: 0 0 4px var(--progression-colors-004);
        }

        &.faster {
            background-color: var(--progression-colors-200);
            box-shadow: 0 0 4px var(--progression-colors-204);
        }

        &.warning {
            background-color: var(--progression-colors-300);
            box-shadow: 0 0 4px var(--progression-colors-304);
        }

        &.pastdue {
            background-color: var(--progression-colors-400);
            box-shadow: 0 0 4px var(--progression-colors-404);
        }
    }
}
</style>
