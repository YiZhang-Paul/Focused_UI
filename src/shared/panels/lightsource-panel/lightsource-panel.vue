<template>
    <div class="lightsource-panel-container">
        <div class="glare"></div>

        <div class="grids" v-if="showGrids">
            <div class="grid-row" v-for="row in 12" :key="row">
                <div class="grid" v-for="column in 22" :key="column">
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';

class LightsourcePanelProp {
    public showGrids = prop<boolean>({ default: false });
}

export default class LightsourcePanel extends Vue.with(LightsourcePanelProp) {}
</script>

<style lang="scss" scoped>
.lightsource-panel-container {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .glare {
        position: absolute;
        top: -70%;
        left: -5%;
        width: 110%;
        height: 150%;
        background: radial-gradient(
            57.36% 57.36% at 50% 42.64%,
            rgba(255, 255, 255, 0.25) 0%,
            rgba(248, 248, 248, 0.25) 0.01%,
            rgba(138, 138, 138, 0) 100%
        );
    }

    .grids {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        width: 100%;
        height: 100%;

        .grid-row {
            display: flex;
            justify-content: space-evenly;
        }

        .grid {
            $grid-line-width: 1px;
            $grid-dimension: 1.5vh;

            position: relative;
            width: $grid-dimension;
            height: $grid-dimension;

            & > div {
                position: absolute;
                background-color: var(--primary-colors-6-01);

                &:first-of-type {
                    top: 0;
                    left: calc(50% - #{$grid-line-width} / 2);
                    width: $grid-line-width;
                    height: $grid-dimension;
                }

                &:last-of-type {
                    top: calc(50% - #{$grid-line-width} / 2);
                    left: 0;
                    width: $grid-dimension;
                    height: $grid-line-width;
                }
            }
        }
    }
}
</style>
