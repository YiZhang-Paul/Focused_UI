<template>
    <div class="background-view">
        <div class="glare"></div>

        <div class="grids">
            <div class="grid-row" v-for="row in 12" :key="row">
                <div class="grid" v-for="column in 22" :key="column">
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    </div>

    <div class="header-displays">
        <current-date-time></current-date-time>
    </div>

    <content-view-panel class="content-view-panel">
        <work-items-management class="work-items-management"></work-items-management>
    </content-view-panel>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import WorkItemsManagement from './features/work-items-management/work-items-management.vue';
import ContentViewPanel from './shared/panels/content-view-panel.vue';
import CurrentDateTime from './shared/widgets/current-date-time.vue';

@Options({
    components: {
        WorkItemsManagement,
        ContentViewPanel,
        CurrentDateTime
    }
})
export default class App extends Vue {}
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

.background-view {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .glare {
        position: absolute;
        top: -70vh;
        left: -5vw;
        width: 110vw;
        height: 150vh;
        background: radial-gradient(
            57.36% 57.36% at 50% 42.64%,
            rgba(255, 255, 255, 0.125) 0%,
            rgba(248, 248, 248, 0.125) 0.01%,
            rgba(138, 138, 138, 0) 100%
        );
    }

    .grids {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        width: 100%;
        height: 100%;

        .grid-row {
            display: flex;
            justify-content: space-evenly;
        }

        .grid {
            $grid-line-width: 1px;
            $grid-dimension: 1.5vh;

            position: relative;
            width: $grid-dimension;
            height: $grid-dimension;

            & > div {
                position: absolute;
                background-color: var(--primary-colors-601);

                &:first-of-type {
                    top: 0;
                    left: calc(50% - #{$grid-line-width} / 2);
                    width: $grid-line-width;
                    height: $grid-dimension;
                }

                &:last-of-type {
                    top: calc(50% - #{$grid-line-width} / 2);
                    left: 0;
                    width: $grid-dimension;
                    height: $grid-line-width;
                }
            }
        }
    }
}

.header-displays {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: $header-displays-height;
}

.content-view-panel {
    width: 100%;
    height: calc(100% - #{$header-displays-height});

    .work-items-management {
        width: 100%;
        height: 100%;
    }
}
</style>
