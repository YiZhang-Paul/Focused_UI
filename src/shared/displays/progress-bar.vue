<template>
    <div class="progress-bar-container">
        <template v-for="block of blocks">
            <div v-for="n in block.total" :key="n" :style="{ 'background-color': block.color }"></div>
        </template>

        <div v-for="n in remainingBlocks" :key="n"></div>
    </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';

import { PercentageSeries } from '../../core/models/generic/percentage-series';

class ProgressBarProp {
    public series = prop<PercentageSeries[]>({ default: [] });
}

export default class ProgressBar extends Vue.with(ProgressBarProp) {
    public readonly totalBlocks = 27;

    get remainingBlocks(): number {
        return this.totalBlocks - this.blocks.reduce((sum, _) => sum + _.total, 0);
    }

    get blocks(): { total: number; color: string }[] {
        const settings = this.series.map(({ percent, color }) => {
            const blocks = Math.round(percent / 100 * this.totalBlocks);
            const total = Math.min(blocks, this.totalBlocks);

            return { total, color };
        });

        if (settings.length > 1) {
            const otherBlocks = settings.slice(0, -1);
            const prefixSum = otherBlocks.reduce((sum, _) => sum + _.total, 0);
            settings.slice(-1)[0].total = this.totalBlocks - prefixSum;
        }

        return settings;
    }
}
</script>

<style lang="scss" scoped>
.progress-bar-container {
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
    }
}
</style>
