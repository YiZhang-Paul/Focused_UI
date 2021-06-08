<template>
    <div class="display-panel-container">
        <div :style="horizontalGuardStyle" v-for="i in 4" :key="i"></div>
        <div :style="verticalGuardStyle" v-for="i in 4" :key="i"></div>
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';

class DisplayPanelProp {
    public lineWidth = prop<string>({ default: '1px' });
    public lineLength = prop<string>({ default: '0.5vh' });
}

export default class DisplayPanel extends Vue.with(DisplayPanelProp) {

    get horizontalGuardStyle(): { [key: string]: string } {
        return {
            width: this.lineLength,
            height: this.lineWidth
        };
    }

    get verticalGuardStyle(): { [key: string]: string } {
        return {
            width: this.lineWidth,
            height: this.lineLength
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
