<template>
    <display-panel class="activity-history-container" :lineLength="'1vh'">
        <div class="focus-breakdowns">
            <div class="breakdown" v-for="(history, index) of histories" :key="index">
                <div class="filler-top"></div>
                <div class="focus-lose"></div>
                <div class="focus-level"></div>
                <div class="focus-gain"></div>
                <div class="filler-bottom"></div>
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
                <div v-if="history.interruption" class="interruption"></div>
                <div v-if="history.regular" class="regular"></div>
                <div v-if="history.overlearning" class="overlearning"></div>
                <div v-if="history.recurring" class="recurring"></div>
            </div>
        </div>
    </display-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import { ActivityBreakdownDto } from '../../core/dtos/activity-breakdown-dto';
import DisplayPanel from '../panels/display-panel.vue';

class ActivityHistoryProp {
    public histories = prop<ActivityBreakdownDto[]>({ default: [] });
}

@Options({
    components: { DisplayPanel }
})
export default class ActivityHistory extends Vue.with(ActivityHistoryProp) {
    public readonly thresholds = [0, 6, 12, 24];
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
        display: flex;
        position: relative;
        margin-bottom: 10px;
        height: 50%;

        .focus-level {
            max-height: 2px;
            height: 2px;
            background-color: var(--primary-colors-0-00);
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
        display: flex;
        height: 30%;

        .breakdown {
            background-color: var(--primary-colors-0-01);

            .interruption {
                background-color: var(--activity-colors-interruption-00);
            }

            .regular {
                background-color: var(--activity-colors-regular-00);
            }

            .overlearning {
                background-color: var(--activity-colors-overlearning-00);
            }

            .recurring {
                background-color: var(--activity-colors-recurring-00);
            }
        }
    }
}
</style>
