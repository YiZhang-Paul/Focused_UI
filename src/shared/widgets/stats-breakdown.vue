<template>
    <display-panel class="stats-breakdown-container">
        <span>{{ title }}</span>
        <span>{{ content }}</span>
        <progress-bar :series="series"></progress-bar>
    </display-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import { PercentageSeries } from '../../core/models/progress-bar/percentage-series';
import DisplayPanel from '../panels/display-panel.vue';
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

</style>
