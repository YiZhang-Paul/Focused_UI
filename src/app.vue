<template>
    <lightsource-panel class="lightsource-panel"></lightsource-panel>

    <div class="header-displays">
        <current-date-time></current-date-time>
    </div>

    <content-view-panel class="content-view-panel">
        <template v-slot:actions>
            <div class="work-items-actions">
                <creation-button @click="startCreate()"></creation-button>
                <search-box class="search-box" @search="onSearch($event)"></search-box>
            </div>
        </template>

        <work-items-management class="work-items-management"></work-items-management>
    </content-view-panel>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from './store';
import { workItemKey } from './store/work-item/work-item.state';
import { WorkItemDto } from './core/dtos/work-item-dto';
import { WorkItemQuery } from './core/models/work-item/work-item-query';
import WorkItemsManagement from './features/work-items-management/work-items-management.vue';
import CreationButton from './shared/buttons/creation-button.vue';
import SearchBox from './shared/inputs/search-box.vue';
import LightsourcePanel from './shared/panels/lightsource-panel.vue';
import ContentViewPanel from './shared/panels/content-view-panel.vue';
import CurrentDateTime from './shared/widgets/current-date-time.vue';

@Options({
    components: {
        WorkItemsManagement,
        CreationButton,
        SearchBox,
        LightsourcePanel,
        ContentViewPanel,
        CurrentDateTime
    }
})
export default class App extends Vue {
    private query = new WorkItemQuery();

    public startCreate(): void {
        store.commit(`${workItemKey}/setPendingWorkItem`, new WorkItemDto());
    }

    public onSearch(text: string): void {
        this.query.searchText = text;
        store.dispatch(`${workItemKey}/loadWorkItems`, this.query);
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

.content-view-panel {
    width: 100%;
    height: calc(100% - #{$header-displays-height});

    .work-items-actions, .work-items-management {
        width: 100%;
        height: 100%;
    }

    .work-items-actions {
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 7.5vh 0 2.5vh;

        .search-box {
            width: 40%;
            height: 80%;
        }
    }
}
</style>
