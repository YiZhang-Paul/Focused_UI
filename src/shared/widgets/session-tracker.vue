<template>
    <div class="session-tracker-container">
        <div class="guard-left"></div>
        <div class="guard-right"></div>
        <div class="guard-top"></div>
        <div class="guard-bottom"></div>

        <div class="name">
            <tag class="icon" />
            <span>waiting for next task...</span>
        </div>

        <div class="drop-text">
            <undo class="icon" />
            <span>drop to continue</span>
        </div>

        <div class="progress">
            <stop-circle class="icon stop-button" @click="$emit('session:stop')" />
            <timer class="icon" />
            <count-down-display class="time" :target="new Date(2021, 5, 21)"></count-down-display>
            <progress-bar class="progress-bar" :series="[]"></progress-bar>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { StopCircle, Tag, Timer, Undo } from 'mdue';

import CountDownDisplay from '../../shared/displays/count-down-display.vue';
import ProgressBar from '../../shared/displays/progress-bar.vue';

@Options({
    components: {
        StopCircle,
        Tag,
        Timer,
        Undo,
        CountDownDisplay,
        ProgressBar
    },
    emits: ['session:stop']
})
export default class SessionTracker extends Vue {}
</script>

<style lang="scss" scoped>
.session-tracker-container {
    $guard-width: 2px;
    $side-guard-height: 50%;

    box-sizing: border-box;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border: 1px solid var(--session-status-colors-waiting-02);
    background-color: var(--session-status-colors-waiting-04);
    color: var(--session-status-colors-waiting-00);
    text-shadow: 0 0 4px var(--session-status-colors-waiting-05);

    .guard-left, .guard-right {
        position: absolute;
        top: calc(50% - #{$side-guard-height} / 2);
        width: $guard-width;
        height: $side-guard-height;
        background-color: var(--session-status-colors-waiting-00);
        box-shadow: 0 0 4px var(--session-status-colors-waiting-05);
    }

    .guard-left {
        left: calc(#{$guard-width} / -2);
    }

    .guard-right {
        right: calc(#{$guard-width} / -2);
    }

    .guard-top, .guard-bottom {
        position: absolute;
        left: 0;
        width: 100%;
        height: $guard-width;
        box-shadow: 0 0 4px var(--session-status-colors-waiting-05);
        background: linear-gradient(
            to right,
            transparent 0,
            var(--session-status-colors-waiting-00) 50%,
            transparent 100%
        );
    }

    .guard-top {
        top: -$guard-width;
    }

    .guard-bottom {
        bottom: -$guard-width;
    }

    .name, .drop-text, .progress {
        display: flex;
        align-items: center;

        span {
            margin-left: 0.5vh;
        }
    }

    .name {
        position: absolute;
        left: 1.5vh;
    }

    .progress {
        justify-content: space-between;
        position: absolute;
        right: 1.5vh;
        width: 32.5%;
        height: 40%;

        .icon {
            font-size: var(--font-sizes-600);
        }

        .stop-button {
            margin-right: 0.35vh;
            color: var(--context-colors-warning-07);
            transition: color 0.3s;

            &:hover {
                cursor: pointer;
                color: var(--context-colors-warning-00);
            }
        }

        .time {
            margin-left: 0.35vh;
            margin-right: 1.5vh;
            font-size: var(--font-sizes-300);
        }

        .progress-bar {
            width: calc(100% - 7.5vh);
            height: 100%;
        }
    }

    .icon {
        font-size: var(--font-sizes-500);
    }
}
</style>
