<template>
    <display-panel class="task-radar-container" :lineLength="'1vh'">
        <div class="rings">
            <div class="ring" v-for="n in 5" :key="n"></div>
            <div class="grid-line" v-for="n in 2" :key="n"></div>

            <template v-if="!showScanWave">
                <div class="point-wrapper"
                    v-for="(point, index) of series"
                    :key="index"
                    :style="getPointWrapperStyle(point)">

                    <div class="point" :style="getPointStyle(point)"></div>
                </div>
            </template>
        </div>

        <div class="scanner">
            <div class="scanner-center"></div>
            <div class="scanner-line"></div>
        </div>

        <div class="scanner-wave" v-if="showScanWave">
            <div v-for="n in 3" :key="n"></div>
        </div>
    </display-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import { StyleConfig } from '../../../core/models/generic/style-config';
import { RadarSeries } from '../../../core/models/generic/radar-series';
import DisplayPanel from '../../panels/display-panel/display-panel.vue';

class TaskRadarProp {
    public series = prop<RadarSeries[]>({ default: [] });
}

@Options({
    components: { DisplayPanel },
    watch: {
        series(): void {
            this.showScanWave = true;
            setTimeout(() => this.showScanWave = false, 1500);
        }
    }
})
/* istanbul ignore next */
export default class TaskRadar extends Vue.with(TaskRadarProp) {
    public showScanWave = false;

    public getPointWrapperStyle(point: RadarSeries): StyleConfig {
        const seed = Math.max(0.2, Math.min(Math.random(), 0.8));
        const offset = (point.quadrant - 1) * 90;

        return { transform: `rotate(${seed * 90 - offset}deg)` };
    }

    public getPointStyle(point: RadarSeries): StyleConfig {
        const { quadrant, value, colorType } = point;
        const percentage = Math.max(2, Math.min(value, 8));
        const dimension = `${0.5 + 0.04 * percentage}vh`;

        return {
            top: `${100 - percentage * 10}%`,
            width: dimension,
            height: dimension,
            'background-color': `var(--${colorType}-00)`,
            'box-shadow': `0 0 6px 3px var(--${colorType}-07)`,
            opacity: 0,
            animation: `glow-fast-3 4.8s ease ${quadrant * 0.4}s infinite`
        };
    }
}
</script>

<style lang="scss" scoped>
.task-radar-container {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--primary-colors-8-01);
    overflow: hidden;

    .rings, .scanner, .scanner-wave {
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

        .point-wrapper {
            position: absolute;
            top: 0;
            height: 50%;
            transform-origin: 50% 100%;

            .point {
                position: absolute;
                border-radius: 50%;
            }
        }
    }

    .scanner {
        transform: rotateX(180deg);
        animation: scan-wave 2.4s linear infinite;
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

        @keyframes scan-wave {
            from { transform: rotateX(180deg) rotate(0); }
            to { transform: rotateX(180deg) rotate(360deg); }
        }
    }

    .scanner-wave {
        position: relative;

        & > div {
            position: absolute;
            width: 0;
            height: 0;
            border-radius: 50%;
            border: 4px solid var(--primary-colors-0-01);
            background-color: var(--primary-colors-0-01);
        }

        & > div:nth-child(1) {
            animation: expand 0.5s ease-in forwards,
                       fade-out 0.1s linear 0.4s forwards;
        }

        & > div:nth-child(2) {
            animation: expand 0.6s ease-in 0.2s forwards,
                       fade-out 0.1s linear 0.7s forwards;
        }

        & > div:nth-child(3) {
            animation: expand 0.8s ease-in 0.3s forwards,
                       fade-out 0.1s linear 1s forwards;
        }
    }
}
</style>
