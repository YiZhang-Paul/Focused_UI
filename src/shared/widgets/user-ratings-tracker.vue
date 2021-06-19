<template>
    <display-panel class="user-ratings-tracker-container" :lineLength="'1vh'">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <path class="background" :d="innerRingPath" />
            <path :class="`inner-ring inner-ring-${i}`" v-for="i in 3" :key="i" :d="innerRingPath" />
            <path class="grid-line" v-for="(path, index) of gridLinePaths" :key="index" :d="path" />
        </svg>
    </display-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import { PerformanceRating } from '../../core/models/user/performance-rating';
import DisplayPanel from '../panels/display-panel.vue';

class UserRatingsTrackerProp {
    public ratings = prop<PerformanceRating>({ default: null });
}

@Options({
    components: { DisplayPanel }
})
export default class UserRatingsTracker extends Vue.with(UserRatingsTrackerProp) {
    private readonly points = [
        { x: 50, y: 4.5 },
        { x: 97.5, y: 39 },
        { x: 77.5, y: 94.5 },
        { x: 22.5, y: 94.5 },
        { x: 2.5, y: 39 },
        { x: 50, y: 4.5 }
    ];

    get innerRingPath(): string {
        return `M${this.points.map(_ => `${_.x} ${_.y}`).join('L')}Z`;
    }

    get gridLinePaths(): string[] {
        return this.points.map(_ => `M50 50 L${_.x} ${_.y}`);
    }
}
</script>

<style lang="scss" scoped>
.user-ratings-tracker-container {
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
    }
}
</style>
