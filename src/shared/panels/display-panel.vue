<template>
    <div class="display-panel-container">
        <div class="guards guard-horizontal" v-for="i in 4" :key="i"></div>
        <div class="guards guard-vertical" v-for="i in 4" :key="i"></div>
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class DisplayPanel extends Vue { }
</script>

<style lang="scss" scoped>
.display-panel-container {
    $line-width: 2px;
    $min-length: 10px;
    $max-length: 25px;

    position: relative;

    .guards {
        position: absolute;
        background-color: var(--primary-colors-000);
        box-shadow: 0 0 4px var(--primary-colors-006);

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

    .guard-horizontal {
        min-width: $min-length;
        max-width: $max-length;
        width: 15%;
        height: $line-width;
    }

    .guard-vertical {
        width: $line-width;
        min-height: $min-length;
        max-height: $max-length;
        height: 15%;
    }
}
</style>
