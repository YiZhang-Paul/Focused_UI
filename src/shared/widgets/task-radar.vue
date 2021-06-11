<template>
    <display-panel class="task-radar-container" :lineLength="'1vh'">
        <div class="rings">
            <div class="ring" v-for="n in 5" :key="n"></div>
            <div class="grid-line" v-for="n in 2" :key="n"></div>
        </div>

        <div class="scanner">
            <div class="scanner-center"></div>
            <div class="scanner-line"></div>
        </div>
    </display-panel>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import DisplayPanel from '../panels/display-panel.vue';

@Options({
    components: { DisplayPanel }
})
export default class TaskRadar extends Vue {}
</script>

<style lang="scss" scoped>
.task-radar-container {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--primary-colors-8-01);
    overflow: hidden;

    .rings, .scanner {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 22.5vh;
        height: 22.5vh;
        border-radius: 50%;
    }

    .rings {
        background-color: var(--primary-colors-0-01);

        .ring {
            $ring-width: calc(100% / 6);

            position: absolute;
            border-radius: 50%;
            border: 1px solid var(--primary-colors-0-03);

            &:nth-child(1) {
                width: $ring-width;
                height: $ring-width;
            }

            &:nth-child(2) {
                width: calc(#{$ring-width} * 2);
                height: calc(#{$ring-width} * 2);
            }

            &:nth-child(3) {
                width: calc(#{$ring-width} * 3);
                height: calc(#{$ring-width} * 3);
            }

            &:nth-child(4) {
                width: calc(#{$ring-width} * 4);
                height: calc(#{$ring-width} * 4);
            }

            &:nth-child(5) {
                width: calc(#{$ring-width} * 5);
                height: calc(#{$ring-width} * 5);
            }
        }

        .grid-line {
            position: absolute;
            background-color: var(--primary-colors-0-03);

            &:nth-child(6) {
                width: 100%;
                height: 1px;
            }

            &:nth-child(7) {
                width: 1px;
                height: 100%;
            }
        }
    }

    .scanner {
        animation: rotate 2.5s linear infinite;
        background: conic-gradient(
            from 90deg at 50% 50%,
            rgba(255, 255, 255, 0) 200deg,
            rgba(255, 255, 255, 0.5) 440deg
        );

        .scanner-center, .scanner-line {
            position: absolute;
            background-color: var(--primary-colors-0-00);
            box-shadow: 0 0 4px var(--primary-colors-0-00);
        }

        .scanner-center {
            width: 4px;
            height: 4px;
            border-radius: 50%;
        }

        .scanner-line {
            left: 50%;
            width: 50%;
            height: 1px;
        }
    }
}
</style>
