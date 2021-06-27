<template>
    <display-panel class="user-ratings-tracker-container" :lineLength="'1vh'">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <path class="background" :d="getClosedPath(points)" />
            <path :class="`inner-ring inner-ring-${i}`" v-for="i in 3" :key="i" :d="getClosedPath(points)" />
            <path class="grid-line" v-for="(path, index) of gridLinePaths" :key="index" :d="path" />
            <path class="ratings-area" :d="ratingsPath" />
        </svg>

        <calendar-check class="icon planning" />
        <clock-time-three class="icon estimation" />
        <head-alert class="icon determination" />
        <shield class="icon sustainability" />
        <yoga class="icon adaptability" />
    </display-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { CalendarCheck, ClockTimeThree, HeadAlert, Shield, Yoga } from 'mdue';
import { Point } from 'electron';

import { PerformanceRating } from '../../core/models/user/performance-rating';
import DisplayPanel from '../panels/display-panel/display-panel.vue';

class UserRatingsTrackerProp {
    public ratings = prop<PerformanceRating>({ default: null });
}

@Options({
    components: {
        CalendarCheck,
        ClockTimeThree,
        HeadAlert,
        Shield,
        Yoga,
        DisplayPanel
    }
})
export default class UserRatingsTracker extends Vue.with(UserRatingsTrackerProp) {
    public readonly points: Point[] = [
        { x: 50, y: 4.5 },
        { x: 97.5, y: 39 },
        { x: 77.5, y: 94.5 },
        { x: 22.5, y: 94.5 },
        { x: 2.5, y: 39 }
    ];

    get gridLinePaths(): string[] {
        return this.points.map(_ => `M50 50 L${_.x} ${_.y}`);
    }

    get ratingsPath(): string {
        const { determination, planning, sustainability, adaptability, estimation } = this.ratings;
        const ratings = [determination, planning, sustainability, adaptability, estimation];

        const points = this.points.map((_, i) => {
            const percentage = ratings[i] / 100;
            const deltaX = Math.abs(50 - _.x) * percentage;
            const deltaY = Math.abs(50 - _.y) * percentage;

            return {
                x: 50 + deltaX * (_.x > 50 ? 1 : -1),
                y: 50 + deltaY * (_.y > 50 ? 1 : -1)
            };
        });

        return this.getClosedPath(points);
    }

    public getClosedPath(points: Point[]): string {
        return `M${points.map(_ => `${_.x} ${_.y}`).join('L')}Z`;
    }
}
</script>

<style lang="scss" scoped>
.user-ratings-tracker-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--primary-colors-8-01);

    svg {
        width: 20vh;
        height: 20vh;

        .background {
            fill: var(--primary-colors-0-01);
        }

        .grid-line {
            stroke: var(--primary-colors-0-00);
            stroke-width: 0.1;
        }

        .inner-ring {
            stroke: var(--primary-colors-10-08);
            transform-origin: 50% 50%;
        }

        .inner-ring-1 {
            stroke-width: 4;
            transform: scale(0.75);
        }

        .inner-ring-2 {
            stroke-width: 6;
            transform: scale(0.5);
        }

        .inner-ring-3 {
            stroke-width: 12;
            transform: scale(0.25);
        }

        .ratings-area {
            fill: var(--primary-colors-0-03);
            stroke: var(--primary-colors-0-00);
            stroke-width: 0.75;
            filter: drop-shadow(0 0 4px rgba(200, 200, 200, 0.4));
            transition: all 0.8s 0.2s;
        }
    }

    .icon {
        $dimension: 2.5vh;

        position: absolute;
        width: $dimension;
        height: $dimension;

        &.estimation, &.planning {
            top: 35%;
        }

        &.adaptability, &.sustainability {
            bottom: 2.75%;
        }

        &.determination {
            top: 2.25%;
        }

        &.estimation {
            left: calc(12% - #{$dimension} / 2);
        }

        &.planning {
            right: calc(12% - #{$dimension} / 2);
        }

        &.adaptability {
            left: calc(28% - #{$dimension} / 2);
        }

        &.sustainability {
            right: calc(28% - #{$dimension} / 2);
        }
    }
}
</style>
