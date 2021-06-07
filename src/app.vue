<template>
    <lightsource-panel class="lightsource-panel"></lightsource-panel>

    <div class="header-displays">
        <current-date-time></current-date-time>
    </div>

    <work-items-management class="work-items-management"></work-items-management>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from './store';
import { performanceKey } from './store/performance/performance.state';
import WorkItemsManagement from './features/work-items-management/work-items-management.vue';
import LightsourcePanel from './shared/panels/lightsource-panel.vue';
import CurrentDateTime from './shared/widgets/current-date-time.vue';

@Options({
    components: {
        WorkItemsManagement,
        LightsourcePanel,
        CurrentDateTime
    }
})
export default class App extends Vue {

    public created(): void {
        store.dispatch(`${performanceKey}/loadCurrentDayProgression`);
    }
}
</script>

<style lang="scss">
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
    background-color: var(--primary-colors-1000);
    color: var(--font-colors-000);
    font-family: 'Roboto';
    font-size: 16px;
}

.lightsource-panel {
    position: absolute;
    top: 0;
    left: 0;
}

.header-displays {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: $header-displays-height;
}

.work-items-management {
    width: 100%;
    height: calc(100% - #{$header-displays-height});
}
</style>
