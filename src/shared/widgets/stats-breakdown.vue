<template>
    <display-panel class="stats-breakdown-container" :lineLength="'1vh'">
        <div class="content">
            <span>{{ title }}</span>
            <span>{{ content }}</span>
        </div>

        <progress-bar class="progress-bar" :series="series"></progress-bar>
    </display-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import { PercentageSeries } from '../../core/models/progress-bar/percentage-series';
import DisplayPanel from '../panels/display-panel/display-panel.vue';
import ProgressBar from '../displays/progress-bar.vue';

class StatsBreakdownProp {
    public title = prop<string>({ default: '' });
    public content = prop<string>({ default: '' });
    public series = prop<PercentageSeries[]>({ default: [] });
}

@Options({
    components: {
        DisplayPanel,
        ProgressBar
    }
})
export default class StatsBreakdown extends Vue.with(StatsBreakdownProp) {}
</script>

<style lang="scss" scoped>
.stats-breakdown-container {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 3.75% 6.5%;
    background-color: var(--primary-colors-8-01);

    .content {
        display: flex;
        justify-content: space-between;
        font-size: var(--font-sizes-300);

        span:first-of-type {
            text-transform: uppercase;
        }
    }

    .progress-bar {
        width: 100%;
        height: 46.5%;
    }
}
</style>
