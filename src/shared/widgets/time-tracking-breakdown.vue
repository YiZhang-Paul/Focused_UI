<template>
    <display-panel class="time-tracking-breakdown-container" :lineLength="'1vh'">
        <div class="tracking-breakdowns" v-if="tracking">
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                <circle class="inner-ring" r="22" />
                <circle class="slice" :style="activityStyle" @mouseenter="index = 0" @mouseleave="index = -1" />
                <circle class="slice" :style="breakStyle" @mouseenter="index = 1" @mouseleave="index = -1" />
                <circle class="slice" :style="untrackedStyle" @mouseenter="index = 2" @mouseleave="index = -1" />
                <circle class="shadow" r="50" fill="url('#shadow-gradient')" />

                <defs>
                    <radialGradient id="shadow-gradient">
                        <stop offset="1%" stop-color="rgba(40, 40, 40, 0.45)"></stop>
                        <stop offset="100%" stop-color="transparent"></stop>
                    </radialGradient>
                </defs>
            </svg>

            <div class="summary" v-if="index !== -1" :style="{ color: colorValue }">
                <span v-if="index === 0">active</span>
                <span v-if="index === 1">rested</span>
                <span v-if="index === 2">untrack</span>
                <span>{{ hoursValue }}</span>
            </div>
        </div>
    </display-panel>
</template>

<script lang="ts">
import { Vue, prop, Options } from 'vue-class-component';
import { Help, LightbulbOn, Sleep } from 'mdue';

import { TimeTrackingBreakdownDto } from '../../core/dtos/time-tracking-breakdown-dto';
import { StyleConfig } from '../../core/models/generic/style-config';
import { GenericUtility } from '../../core/utilities/generic-utility/generic-utility';
import DisplayPanel from '../panels/display-panel.vue';

class TimeTrackingBreakdownProp {
    public tracking = prop<TimeTrackingBreakdownDto>({ default: null });
}

@Options({
    components: {
        Help,
        LightbulbOn,
        Sleep,
        DisplayPanel
    }
})
export default class TimeTrackingBreakdown extends Vue.with(TimeTrackingBreakdownProp) {
    public index = -1;

    get hoursValue(): string {
        if (this.index === -1) {
            return '';
        }

        const { activityTime, breakTime, untrackedTime } = this.tracking;
        const value = [activityTime, breakTime, untrackedTime][this.index];

        return `${GenericUtility.roundTo(value, 1)}h`;
    }

    get colorValue(): string {
        if (this.index === -1) {
            return '';
        }

        const colors = [this.activityStyle.stroke, this.breakStyle.stroke, 'rgb(100, 100, 100)'];

        return String(colors[this.index]);
    }

    get activityStyle(): StyleConfig {
        return {
            stroke: 'rgb(255, 255, 255)',
            transform: `rotate(${-90 - 360 / 24 * this.tracking.activityTime}deg)`,
            ...this.getSharedStyle(this.index === 0, this.tracking.activityTime)
        };
    }

    get breakStyle(): StyleConfig {
        return {
            stroke: 'rgb(142, 222, 174)',
            transform: 'rotate(-90deg)',
            ...this.getSharedStyle(this.index === 1, this.tracking.breakTime)
        };
    }

    get untrackedStyle(): StyleConfig {
        return {
            stroke: 'rgb(100, 100, 100)',
            transform: `rotate(${-90 + 360 / 24 * this.tracking.breakTime}deg)`,
            ...this.getSharedStyle(this.index === 2, this.tracking.untrackedTime)
        };
    }

    private getSharedStyle(isHovered: boolean, time: number): StyleConfig {
        const [inner, outer] = isHovered ? [23.75, 50] : [33, 46];
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
        width: 22.5vh;
        height: 22.5vh;

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

        .summary {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            opacity: 0;
            animation: fade-in 0.3s ease forwards;

            span:first-of-type {
                margin-bottom: 0.25vh;
                text-transform: uppercase;
                font-size: var(--font-sizes-300);
            }

            span:last-of-type {
                font-size: var(--font-sizes-600);
            }
        }
    }
}
</style>
