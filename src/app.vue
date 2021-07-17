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

import store from './store';
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
        store.user.dispatch(this.$store, store.user.keys.actions.LoadProfile);
        store.timeSession.dispatch(this.$store, store.timeSession.keys.actions.LoadActiveTimeSession);
        store.timeSession.dispatch(this.$store, store.timeSession.keys.actions.LoadStaleTimeSession);
        store.timeSession.dispatch(this.$store, store.timeSession.keys.actions.SyncActiveTimeSession);
        this.loadPerformanceBreakdowns();
    }

    public loadPerformanceBreakdowns(): void {
        store.performance.dispatch(this.$store, store.performance.keys.actions.LoadCurrentDayProgression);
        store.performance.dispatch(this.$store, store.performance.keys.actions.LoadCurrentDayTimeTracking);
        store.performance.dispatch(this.$store, store.performance.keys.actions.LoadActivityBreakdown);
        store.performance.dispatch(this.$store, store.performance.keys.actions.LoadActivityHistories);
        store.performance.dispatch(this.$store, store.performance.keys.actions.LoadEstimationBreakdown);
        store.performance.dispatch(this.$store, store.performance.keys.actions.LoadDueDateBreakdown);
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
