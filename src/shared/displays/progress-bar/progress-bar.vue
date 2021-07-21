<template>
    <div class="progress-bar-container">
        <template v-for="group of blockGroups">
            <div v-for="n in group.total" :key="n" :style="getGroupStyle(group)"></div>
        </template>

        <div v-for="n in placeholders" :key="n"></div>
    </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';

import { StyleConfig } from '../../../core/models/generic/style-config';
import { PercentageSeries } from '../../../core/models/progress-bar/percentage-series';
import { BlockGroup } from '../../../core/models/progress-bar/block-group';
import { GenericUtility } from '../../../core/utilities/generic-utility/generic-utility';

class ProgressBarProp {
    public series = prop<PercentageSeries[]>({ default: [] });
}
/* istanbul ignore next */
export default class ProgressBar extends Vue.with(ProgressBarProp) {
    private readonly blocks = 27;

    get blockGroups(): BlockGroup[] {
        const total = GenericUtility.sum(this.series, _ => _.percent);

        const groups: BlockGroup[] = this.series.filter(_ => _.percent).map(_ => {
            const blocks = _.percent / Math.max(100, total) * this.blocks;
            const backgroundColor = `var(--${_.colorType}-00)`;
            const shadowColor = `var(--${_.colorType}-04)`;

            return new BlockGroup(Math.round(blocks), backgroundColor, shadowColor);
        });

        const blocks = GenericUtility.sum(groups, _ => _.total);

        if (blocks > this.blocks) {
            const otherBlocks = GenericUtility.sum(groups.slice(0, -1), _ => _.total);
            groups.slice(-1)[0].total = this.blocks - otherBlocks;
        }

        return groups;
    }

    get placeholders(): number {
        return this.blocks - GenericUtility.sum(this.blockGroups, _ => _.total);
    }

    public getGroupStyle(group: BlockGroup): StyleConfig {
        return {
            'background-color': group.backgroundColor,
            'box-shadow': `0 0 4px ${group.shadowColor}`
        };
    }
}
</script>

<style lang="scss" scoped>
.progress-bar-container {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background-color: var(--primary-colors-0-01);

    & > div {
        $total-blocks: 27;
        $block-gap: 3px;
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
