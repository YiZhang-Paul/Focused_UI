<template>
    <display-panel class="time-tracking-breakdown-container" :lineLength="'1vh'">
        <div class="tracking-breakdowns" v-if="tracking">
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                <circle :style="activityStyle" @mouseenter="active = 0" @mouseleave="active = -1" />
                <circle :style="breakStyle" @mouseenter="active = 1" @mouseleave="active = -1" />
                <circle :style="untrackedStyle" @mouseenter="active = 2" @mouseleave="active = -1" />
                <circle class="shadow" r="50" fill="url('#shadow-gradient')" />

                <defs>
                    <radialGradient id="shadow-gradient">
                        <stop offset="1%" stop-color="rgba(40, 40, 40, 0.45)"></stop>
                        <stop offset="100%" stop-color="transparent"></stop>
                    </radialGradient>
                </defs>
            </svg>
        </div>
    </display-panel>
</template>

<script lang="ts">
import { Vue, prop, Options } from 'vue-class-component';

import { TimeTrackingBreakdownDto } from '../../core/dtos/time-tracking-breakdown-dto';
import { StyleConfig } from '../../core/models/generic/style-config';
import DisplayPanel from '../panels/display-panel.vue';

class TimeTrackingBreakdownProp {
    public tracking = prop<TimeTrackingBreakdownDto>({ default: null });
}

@Options({
    components: { DisplayPanel }
})
export default class TimeTrackingBreakdown extends Vue.with(TimeTrackingBreakdownProp) {
    public active = -1;

    get activityStyle(): StyleConfig {
        return {
            stroke: 'rgb(255, 255, 255)',
            transform: `rotate(${-90 - 360 / 24 * this.tracking.activityTime}deg)`,
            ...this.getSharedStyle(this.active === 0, this.tracking.activityTime)
        };
    }

    get breakStyle(): StyleConfig {
        return {
            stroke: 'rgb(142, 222, 174)',
            transform: 'rotate(-90deg)',
            ...this.getSharedStyle(this.active === 1, this.tracking.breakTime)
        };
    }

    get untrackedStyle(): StyleConfig {
        return {
            stroke: 'rgba(150, 150, 150, 0.5)',
            transform: `rotate(${-90 + 360 / 24 * this.tracking.breakTime}deg)`,
            ...this.getSharedStyle(this.active === 2, this.tracking.untrackedTime)
        };
    }

    private getSharedStyle(isHovered: boolean, time: number): StyleConfig {
        const [inner, outer] = isHovered ? [14, 50] : [30, 46];
        const radius = (outer + inner) / 2;
        const dasharray = 2 * Math.PI * radius;

        return {
            r: radius,
            'stroke-width': outer - inner,
            'stroke-dasharray': dasharray,
            'stroke-dashoffset': dasharray / 24 * (24 - time),
            transition: `all ${isHovered ? 0.3 : 0.02}s`
        };
    }
}
</script>

<style lang="scss" scoped>
.time-tracking-breakdown-container {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--primary-colors-8-01);
    overflow: hidden;

    .tracking-breakdowns {
        position: relative;
        width: 20vh;
        height: 20vh;

        svg {
            position: absolute;
            width: 100%;
            height: 100%;

            circle {
                cx: 50;
                cy: 50;
                transform-origin: 50% 50%;

                &:hover {
                    cursor: pointer;
                }
            }

            .shadow {
                pointer-events: none;
            }
        }
    }
}
</style>
