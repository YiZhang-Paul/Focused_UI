<template>
    <display-panel class="activity-history-container" :lineLength="'1vh'">
        <div class="focus-breakdowns">
            <div class="breakdown" v-for="(history, index) of histories" :key="index">
                <div :style="getFillerStyle(index)"></div>
                <div class="focus-lose" :style="getFocusChangeStyle(index, false)"></div>
                <div class="focus-level"></div>
                <div class="focus-gain" :style="getFocusChangeStyle(index, true)"></div>
            </div>

            <div class="guideline"
                v-for="(threshold, index) of thresholds"
                :class="`guideline-${index}`"
                :key="threshold"
                :style="{ bottom: `${threshold / 24 * 100}%` }">

                <span>{{ threshold }}</span>
            </div>
        </div>

        <div class="activity-breakdowns">
            <div class="breakdown" v-for="(history, index) of histories" :key="index">
                <div v-if="history.interruption"
                    class="interruption"
                    :style="getBreakdownStyle(history.interruption, history)">
                </div>

                <div v-if="history.regular"
                    class="regular"
                    :style="getBreakdownStyle(history.regular, history)">
                </div>

                <div v-if="history.overlearning"
                    class="overlearning"
                    :style="getBreakdownStyle(history.overlearning, history)">
                </div>

                <div v-if="history.recurring"
                    class="recurring"
                    :style="getBreakdownStyle(history.recurring, history)">
                </div>
            </div>

            <span v-if="startDate">{{ startDate }}</span>
            <span v-if="endDate">{{ endDate }}</span>
        </div>
    </display-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import { DateRange } from '../../../core/models/generic/date-range';
import { ActivityBreakdownDto } from '../../../core/dtos/activity-breakdown-dto';
import { StyleConfig } from '../../../core/models/generic/style-config';
import DisplayPanel from '../../panels/display-panel/display-panel.vue';

class ActivityHistoryProp {
    public dateRange = prop<DateRange>({ default: null });
    public histories = prop<ActivityBreakdownDto[]>({ default: [] });
}

@Options({
    components: { DisplayPanel }
})
/* istanbul ignore next */
export default class ActivityHistory extends Vue.with(ActivityHistoryProp) {
    public readonly thresholds = [0, 8, 12, 24];

    get startDate(): string {
        const date = this.dateRange.start.toDateString();

        return date.split(' ').slice(1, 3).join(' ');
    }

    get endDate(): string {
        const oneDay = 24 * 60 * 60 * 1000;
        const date = new Date(this.dateRange.end.getTime() - oneDay);

        return date.toDateString().split(' ').slice(1, 3).join(' ');
    }

    public getFillerStyle(index: number): StyleConfig {
        const previous = index ? this.getFocus(this.histories[index - 1]) : 0;
        const current = this.getFocus(this.histories[index]);
        const height = `${100 - Math.max(previous, current) / 24 * 100}%`;

        return { height, 'max-height': height };
    }

    public getFocusChangeStyle(index: number, isGain: boolean): StyleConfig {
        if (!index) {
            return { height: 0, 'max-height': 0 };
        }

        const previous = this.getFocus(this.histories[index - 1]);
        const current = this.getFocus(this.histories[index]);
        const height = Math.abs(current - previous) / 24 * 100;

        return {
            'margin-top': isGain && height ? '1px' : 0,
            'margin-bottom': !isGain && height ? '1px' : 0,
            height: `${height}%`,
            'max-height': `${height}%`
        };
    }

    public getBreakdownStyle(hours: number, breakdown: ActivityBreakdownDto): StyleConfig {
        return { 'max-height': `${hours / this.getFocus(breakdown) * 100}%` };
    }

    private getFocus(breakdown: ActivityBreakdownDto): number {
        const { regular, recurring, overlearning, interruption } = breakdown;

        return regular + recurring + overlearning + interruption;
    }
}
</script>

<style lang="scss" scoped>
.activity-history-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--primary-colors-8-01);

    .focus-breakdowns, .activity-breakdowns {
        display: flex;
        position: relative;
        width: 77.5%;

        .breakdown {
            z-index: 1;
            display: flex;
            flex-direction: column;
            flex: 1;

            &:not(:first-of-type) {
                margin-left: 1px;
            }

            & > div {
                flex: 1;
            }
        }
    }

    .focus-breakdowns {
        margin-bottom: 10px;
        height: 40%;

        .focus-lose {
            background-color: var(--context-colors-decrease-00);
            box-shadow: 0 0 8px var(--context-colors-decrease-04);
        }

        .focus-level {
            max-height: 2px;
            height: 2px;
            background-color: var(--primary-colors-0-00);
            box-shadow: 0 0 8px var(--primary-colors-0-03);
        }

        .focus-gain {
            background-color: var(--context-colors-increase-00);
            box-shadow: 0 0 8px var(--context-colors-increase-04);
        }

        .guideline {
            z-index: 0;
            display: flex;
            align-items: center;
            position: absolute;
            width: 100%;
            height: 1px;
            color: var(--primary-colors-0-03);
            background-color: var(--primary-colors-0-03);

            &.guideline-0 {
                color: var(--focus-progress-colors-insufficient-05);
                background-color: var(--focus-progress-colors-insufficient-05);
            }

            &.guideline-1 {
                color: var(--focus-progress-colors-sufficient-05);
                background-color: var(--focus-progress-colors-sufficient-05);
            }

            &.guideline-2 {
                color: var(--focus-progress-colors-overdoing-05);
                background-color: var(--focus-progress-colors-overdoing-05);
            }

            span {
                $font-size: var(--font-sizes-200);

                position: absolute;
                left: calc(#{$font-size} * -1.8);
                width: calc(#{$font-size} * 1.5);
                text-align: right;
                font-size: $font-size;
            }
        }
    }

    .activity-breakdowns {
        height: 25%;

        .breakdown {
            background-color: var(--primary-colors-0-01);

            .interruption {
                background-color: var(--activity-colors-interruption-00);
                box-shadow: 0 0 8px var(--activity-colors-interruption-04);
            }

            .regular {
                background-color: var(--activity-colors-regular-00);
                box-shadow: 0 0 8px var(--activity-colors-regular-04);
            }

            .overlearning {
                background-color: var(--activity-colors-overlearning-00);
                box-shadow: 0 0 8px var(--activity-colors-overlearning-04);
            }

            .recurring {
                background-color: var(--activity-colors-recurring-00);
                box-shadow: 0 0 8px var(--activity-colors-recurring-04);
            }
        }

        span {
            $font-size: var(--font-sizes-200);

            position: absolute;
            bottom: calc(#{$font-size} * -1.75);
            font-size: $font-size;

            &:first-of-type {
                left: calc(#{$font-size} * -1.25);
            }

            &:last-of-type {
                right: calc(#{$font-size} * -1.25);
            }
        }
    }
}
</style>
