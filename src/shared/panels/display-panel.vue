<template>
    <div class="display-panel-container">
        <div :style="getHorizontalGuardStyle(i - 1)" v-for="i in 4" :key="i"></div>
        <div :style="getVerticalGuardStyle(i - 1)" v-for="i in 4" :key="i"></div>
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';

import { StyleConfig } from '../../core/models/generic/style-config';

class DisplayPanelProp {
    public lineWidth = prop<string>({ default: '1px' });
    public lineLength = prop<string>({ default: '0.5vh' });
    public corners = prop<[boolean, boolean, boolean, boolean]>({ default: [true, true, true, true] });
}

export default class DisplayPanel extends Vue.with(DisplayPanelProp) {

    public getHorizontalGuardStyle(index: number): StyleConfig {
        return {
            width: this.lineLength,
            height: this.lineWidth,
            opacity: this.corners[index] ? 1 : 0
        };
    }

    public getVerticalGuardStyle(index: number): StyleConfig {
        return {
            width: this.lineWidth,
            height: this.lineLength,
            opacity: this.corners[index] ? 1 : 0
        };
    }
}
</script>

<style lang="scss" scoped>
.display-panel-container {
    position: relative;

    & > div {
        position: absolute;
        background-color: var(--primary-colors-0-00);
        box-shadow: 0 0 4px var(--primary-colors-0-00);

        &:nth-child(1), &:nth-child(5) {
            left: 0;
            top: 0;
        }

        &:nth-child(2), &:nth-child(6) {
            right: 0;
            top: 0;
        }

        &:nth-child(3), &:nth-child(7) {
            right: 0;
            bottom: 0;
        }

        &:nth-child(4), &:nth-child(8) {
            left: 0;
            bottom: 0;
        }
    }
}
</style>
