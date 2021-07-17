<template>
    <lightsource-panel class="lightsource-panel" :showGrids="true"></lightsource-panel>

    <div class="header-displays">
        <user-widget class="user-widget"></user-widget>
        <current-date-time></current-date-time>
        <daily-focus-progression class="daily-progression"></daily-focus-progression>
    </div>

    <work-items-management class="work-items-management"
        @session:stop="loadPerformanceBreakdowns()"
        @item:update="loadPerformanceBreakdowns()"
        @item:delete="loadPerformanceBreakdowns()">
    </work-items-management>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import { userDispatch } from './store/user/user.store';
import { UserAction } from './store/user/user.actions';
import { TimeSessionAction } from './store/time-session/time-session.actions';
import { timeSessionDispatch } from './store/time-session/time-session.store';
import { PerformanceAction } from './store/performance/performance.actions';
import { performanceDispatch } from './store/performance/performance.store';
import WorkItemsManagement from './features/work-items-management/work-items-management.vue';
import LightsourcePanel from './shared/panels/lightsource-panel/lightsource-panel.vue';
import UserWidget from './shared/widgets/user-widget/user-widget.vue';
import CurrentDateTime from './shared/widgets/current-date-time/current-date-time.vue';
import DailyFocusProgression from './shared/widgets/daily-focus-progression/daily-focus-progression.vue';

@Options({
    components: {
        WorkItemsManagement,
        LightsourcePanel,
        UserWidget,
        CurrentDateTime,
        DailyFocusProgression
    }
})
export default class App extends Vue {

    public created(): void {
        userDispatch(this.$store, UserAction.LoadProfile);
        timeSessionDispatch(this.$store, TimeSessionAction.LoadActiveTimeSession);
        timeSessionDispatch(this.$store, TimeSessionAction.LoadStaleTimeSession);
        timeSessionDispatch(this.$store, TimeSessionAction.SyncActiveTimeSession);
        this.loadPerformanceBreakdowns();
    }

    public loadPerformanceBreakdowns(): void {
        performanceDispatch(this.$store, PerformanceAction.LoadCurrentDayProgression);
        performanceDispatch(this.$store, PerformanceAction.LoadCurrentDayTimeTracking);
        performanceDispatch(this.$store, PerformanceAction.LoadActivityBreakdown);
        performanceDispatch(this.$store, PerformanceAction.LoadActivityHistories);
        performanceDispatch(this.$store, PerformanceAction.LoadEstimationBreakdown);
        performanceDispatch(this.$store, PerformanceAction.LoadDueDateBreakdown);
    }
}
</script>

<style lang="scss">
@import './styles/animations.scss';
@import './styles/presets.scss';

$header-displays-height: 20%;

html, body, #app {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    user-select: none;
}

#app {
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: var(--primary-colors-10-00);
    color: var(--font-colors-0-00);
    font-family: 'Roboto';
    font-size: 16px;
}

.lightsource-panel {
    position: absolute;
    top: 0;
    left: 0;
}

.header-displays {
    position: relative;
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: $header-displays-height;

    .user-widget, .daily-progression {
        position: absolute;
    }

    .user-widget {
        left: 5vh;
    }

    .daily-progression {
        right: 5vh;
    }
}

.work-items-management {
    width: 100%;
    height: calc(100% - #{$header-displays-height});
}
</style>
