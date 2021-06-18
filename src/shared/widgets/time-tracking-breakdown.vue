<template>
    <display-panel class="time-tracking-breakdown-container" :lineLength="'1vh'">
        <div class="tracking-breakdowns" v-if="tracking">
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                <g>
                    <circle class="inner-ring" r="22" />
                    <circle class="inner-ring" r="12" />
                </g>

                <circle class="slice" :style="activityStyle" @mouseenter="active = 0" @mouseleave="active = -1" />
                <circle class="slice" :style="breakStyle" @mouseenter="active = 1" @mouseleave="active = -1" />
                <circle class="slice" :style="untrackedStyle" @mouseenter="active = 2" @mouseleave="active = -1" />
                <circle class="shadow" r="50" fill="url('#shadow-gradient')" />

                <defs>
                    <radialGradient id="shadow-gradient">
                        <stop offset="1%" stop-color="rgba(40, 40, 40, 0.45)"></stop>
                        <stop offset="100%" stop-color="transparent"></stop>
                    </radialGradient>
                </defs>
            </svg>

            <span v-if="hoursValue" :style="{ color: colorValue }">{{ hoursValue }}</span>
        </div>
    </display-panel>
</template>

<script lang="ts">
import { Vue, prop, Options } from 'vue-class-component';

import { TimeTrackingBreakdownDto } from '../../core/dtos/time-tracking-breakdown-dto';
import { StyleConfig } from '../../core/models/generic/style-config';
import { GenericUtility } from '../../core/utilities/generic-utility/generic-utility';
import DisplayPanel from '../panels/display-panel.vue';

class TimeTrackingBreakdownProp {
    public tracking = prop<TimeTrackingBreakdownDto>({ default: null });
}

@Options({
    components: { DisplayPanel }
})
export default class TimeTrackingBreakdown extends Vue.with(TimeTrackingBreakdownProp) {
    public active = -1;

    get hoursValue(): string {
        if (this.active === -1) {
            return '';
        }

        const { activityTime, breakTime, untrackedTime } = this.tracking;
        const value = [activityTime, breakTime, untrackedTime][this.active];

        return `${GenericUtility.roundTo(value, 1)}h`;
    }

    get colorValue(): string {
        if (this.active === -1) {
            return '';
        }

        const colors = ['255, 255, 255', '142, 222, 174', '180, 180, 180'];

        return `rgb(${colors[this.active]})`;
    }

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
            stroke: 'rgb(100, 100, 100)',
            transform: `rotate(${-90 + 360 / 24 * this.tracking.breakTime}deg)`,
            ...this.getSharedStyle(this.active === 2, this.tracking.untrackedTime)
        };
    }

    private getSharedStyle(isHovered: boolean, time: number): StyleConfig {
        const [inner, outer] = isHovered ? [12.75, 50] : [32, 45];
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
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20vh;
        height: 20vh;

        svg {
            z-index: 0;
            position: absolute;
            width: 100%;
            height: 100%;

            circle {
                cx: 50;
                cy: 50;
            }

            .inner-ring {
                fill: rgba(59, 68, 91, 0.3);
                stroke: rgba(255, 255, 255, 0.35);
                stroke-width: 0.75;
            }

            .slice {
                transform-origin: 50% 50%;

                &:hover {
                    cursor: pointer;
                }
            }

            .shadow {
                pointer-events: none;
            }
        }

        span {
            z-index: 1;
            font-size: var(--font-sizes-300);
            opacity: 0;
            animation: fade-in 0.3s ease forwards;
        }
    }
}
</style>
