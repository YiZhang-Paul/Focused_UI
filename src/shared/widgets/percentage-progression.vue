<template>
    <div class="percentage-progression-container">
        <div v-for="i in 27" :key="i"></div>
    </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';

import { ProgressionCounter } from '../../core/models/generic/progression-counter';

class PercentageProgressionProp {
    public progress = prop<ProgressionCounter<number>>({ default: null });
    public isCompleted = prop<boolean>({ default: false });
}

export default class PercentageProgression extends Vue.with(PercentageProgressionProp) {}
</script>

<style lang="scss" scoped>
.percentage-progression-container {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background-color: var(--primary-colors-001);

    & > div {
        $total-blocks: 25;
        $block-gap: 3px;
        $side-gap: 5px;
        $width: calc((100% - #{$side-gap} - (#{$total-blocks} - 1) * #{$block-gap}) / #{$total-blocks});

        min-width: $width;
        width: $width;
        height: 150%;
        background-color: var(--primary-colors-000);
        box-shadow: 0 0 4px var(--primary-colors-006);
        transform: rotateZ(25deg);

        &:not(:first-of-type) {
            margin-left: $block-gap;
        }
    }
}
</style>
