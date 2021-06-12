<template>
    <display-panel class="activity-history-container" :lineLength="'1vh'">
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
export default class ActivityHistory extends Vue.with(ActivityHistoryProp) {}
</script>

<style lang="scss" scoped>
.activity-history-container {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--primary-colors-8-01);

    .activity-breakdowns {
        display: flex;
        width: 80%;
        height: 30%;

        .breakdown {
            display: flex;
            flex-direction: column;
            flex: 1;
            background-color: var(--primary-colors-0-01);

            &:not(:first-of-type) {
                margin-left: 1px;
            }

            & > div {
                flex: 1;
            }

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
