<template>
    <div class="session-tracker-container" :style="containerStyle">
        <div class="guard-left" :style="verticalGuardStyle"></div>
        <div class="guard-right" :style="verticalGuardStyle"></div>
        <div class="guard-top" :style="horizontalGuardStyle"></div>
        <div class="guard-bottom" :style="horizontalGuardStyle"></div>

        <div class="name">
            <component class="icon"
                :is="icon.content"
                :style="{ color: icon.color }">
            </component>

            <span>{{ title }}</span>
        </div>

        <div class="filler"></div>

        <div class="time-progress">
            <stop-circle class="icon stop-button" v-if="hasOngoingSession" @click="$emit('session:stop')" />
            <timer class="icon" />
            <count-down-display class="time" :target="ongoingSessionEnd"></count-down-display>
        </div>

        <progress-bar class="progress-bar" :series="progressSeries"></progress-bar>

        <div class="drop-text">
            <undo class="icon" />
            <span>{{ dropItemText }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { StopCircle, Tag, Timer, Undo } from 'mdue';

import store from '../../../store';
import { FocusSessionDto } from '../../../core/dtos/focus-session-dto';
import { IconMeta } from '../../../core/models/generic/icon-meta';
import { StyleConfig } from '../../../core/models/generic/style-config';
import { BreakSession } from '../../../core/models/time-session/break-session';
import { PercentageSeries } from '../../../core/models/progress-bar/percentage-series';
import { WorkItemStatus } from '../../../core/enums/work-item-status.enum';
import { TimeSessionStatus } from '../../../core/enums/time-session-status.enum';
import { IconUtility } from '../../../core/utilities/icon-utility/icon-utility';
import CountDownDisplay from '../../displays/count-down-display/count-down-display.vue';
import ProgressBar from '../../displays/progress-bar/progress-bar.vue';

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
export default class SessionTracker extends Vue {
    private readonly oneHour = 60 * 60 * 1000;

    get containerStyle(): StyleConfig {
        return {
            border: `1px solid var(--${this.colorType}-02)`,
            'background-color': `var(--${this.colorType}-04)`,
            color: `var(--${this.colorType}-00)`,
            'text-shadow': `0 0 4px var(--${this.colorType}-05)`
        };
    }

    get verticalGuardStyle(): StyleConfig {
        return {
            'background-color': `var(--${this.colorType}-00)`,
            'box-shadow': `0 0 4px var(--${this.colorType}-05)`
        };
    }

    get horizontalGuardStyle(): StyleConfig {
        return {
            'box-shadow': `0 0 4px var(--${this.colorType}-05)`,
            background: `linear-gradient(
                to right,
                transparent 0,
                var(--${this.colorType}-00) 50%,
                transparent 100%
            )`
        };
    }

    get icon(): IconMeta {
        return IconUtility.getTimeSessionIcon(this.sessionStatus);
    }

    get title(): string {
        if (this.isIdle) {
            return 'no active item.';
        }

        if (this.isPending) {
            return 'waiting for next item...';
        }

        if (this.isResting) {
            return 'taking a break...';
        }

        const items = this.focusSession!.workItems;
        const item = items.find(_ => _.status === WorkItemStatus.Ongoing);

        return item!.name ? item!.name : 'N/A';
    }

    get dropItemText(): string {
        if (this.sessionStatus === TimeSessionStatus.Ongoing) {
            return 'drop to swap';
        }

        return `drop to ${this.isPending ? 'continue' : 'start'}`;
    }

    get progressSeries(): PercentageSeries[] {
        if (this.isIdle) {
            return [];
        }

        const start = this.isResting ? this.breakSession!.startTime : this.focusSession!.startTime;
        const duration = this.isResting ? this.breakSession!.targetDuration : this.focusSession!.targetDuration;
        const color = this.isResting ? 'session-status-colors-resting' : 'activity-colors-regular';
        const elapsed = (Date.now() - new Date(start).getTime()) / this.oneHour;
        const percent = Math.min(100, elapsed / duration * 100);

        return [new PercentageSeries(percent, color)];
    }

    get colorType(): string {
        if (this.isIdle) {
            return 'session-status-colors-idle';
        }

        if (this.isResting) {
            return 'session-status-colors-resting';
        }

        return this.isPending ? 'session-status-colors-pending' : 'session-status-colors-ongoing';
    }

    get isIdle(): boolean {
        return this.sessionStatus === TimeSessionStatus.Idle;
    }

    get isPending(): boolean {
        return this.sessionStatus === TimeSessionStatus.Pending;
    }

    get isResting(): boolean {
        return this.sessionStatus === TimeSessionStatus.Resting;
    }

    get hasOngoingSession(): boolean {
        return store.timeSession.getters(store.timeSession.getter.HasOngoingTimeSession);
    }

    get ongoingSessionEnd(): Date | null {
        return store.timeSession.getters(store.timeSession.getter.OngoingTimeSessionEnd);
    }

    get sessionStatus(): TimeSessionStatus {
        return store.timeSession.getters(store.timeSession.getter.TimeSessionStatus);
    }

    get focusSession(): FocusSessionDto | null {
        return store.timeSession.getters(store.timeSession.getter.ActiveFocusSession);
    }

    get breakSession(): BreakSession | null {
        return store.timeSession.getters(store.timeSession.getter.ActiveBreakSession);
    }
}
</script>

<style lang="scss" scoped>
.session-tracker-container {
    $guard-width: 2px;
    $vertical-guard-height: 50%;

    box-sizing: border-box;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 1.5vh;

    .guard-left, .guard-right {
        position: absolute;
        top: calc(50% - #{$vertical-guard-height} / 2);
        width: $guard-width;
        height: $vertical-guard-height;
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
    }

    .guard-top {
        top: -$guard-width;
    }

    .guard-bottom {
        bottom: -$guard-width;
    }

    .name, .drop-text, .time-progress {
        display: flex;
        align-items: center;

        span {
            margin-left: 0.5vh;
        }
    }

    .filler {
        flex: 1;
    }

    .time-progress {
        justify-content: space-between;
        margin-right: 1.5vh;
        height: 40%;

        .icon {
            font-size: var(--font-sizes-600);
        }

        .stop-button {
            margin-right: 0.35vh;
            color: var(--primary-colors-0-00);
            transition: color 0.3s;

            &:hover {
                cursor: pointer;
                color: var(--context-colors-warning-00);
            }
        }

        .time {
            margin-left: 0.35vh;
            font-size: var(--font-sizes-300);
        }
    }

    .progress-bar {
        width: 25%;
        height: 40%;
    }

    .drop-text {
        position: absolute;
    }

    .icon {
        font-size: var(--font-sizes-500);
    }
}
</style>
