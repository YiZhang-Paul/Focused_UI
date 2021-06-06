<template>
    <content-view-panel class="work-items-management-container">
        <template v-slot:actions>
            <div class="actions">
                <creation-button @click="startCreate()"></creation-button>
                <search-box class="search-box" @search="onSearch($event)"></search-box>

                <segmented-control class="filter-group"
                    :title="'completed'"
                    :options="completionFilterOptions">
                </segmented-control>
            </div>
        </template>

        <div class="content">
            <work-items-list class="work-items-list"
                :pendingItem="pendingItem"
                @create:cancel="cancelCreate()"
                @create:confirm="confirmCreate()">
            </work-items-list>
        </div>
    </content-view-panel>
</template>

<script lang="ts">
import { markRaw } from 'vue';
import { Options, Vue } from 'vue-class-component';
import { Check, Close, RecordCircleOutline } from 'mdue';

import store from '../../store';
import { workItemKey } from '../../store/work-item/work-item.state';
import { WorkItemDto } from '../../core/dtos/work-item-dto';
import { IconMeta } from '../../core/models/generic/icon-meta';
import { WorkItemQuery } from '../../core/models/work-item/work-item-query';
import SearchBox from '../../shared/inputs/search-box.vue';
import SegmentedControl from '../../shared/inputs/segmented-control.vue';
import CreationButton from '../../shared/buttons/creation-button.vue';
import ContentViewPanel from '../../shared/panels/content-view-panel.vue';

import WorkItemsList from './work-items-list/work-items-list.vue';

@Options({
    components: {
        SearchBox,
        SegmentedControl,
        CreationButton,
        ContentViewPanel,
        WorkItemsList
    }
})
export default class WorkItemsManagement extends Vue {
    public readonly completionFilterOptions = [
        {
            name: 'all',
            content: markRaw(RecordCircleOutline),
            color: 'rgb(120, 255, 255)'
        } as IconMeta,
        {
            name: 'completed',
            content: markRaw(Check),
            color: 'rgb(15, 255, 39)'
        } as IconMeta,
        {
            name: 'incomplete',
            content: markRaw(Close),
            color: 'rgb(255, 0, 0)'
        } as IconMeta
    ];

    private query = new WorkItemQuery();

    get pendingItem(): WorkItemDto | null {
        return store.getters[`${workItemKey}/pendingWorkItem`];
    }

    public created(): void {
        store.dispatch(`${workItemKey}/loadWorkItems`, null);
    }

    public startCreate(): void {
        store.commit(`${workItemKey}/setPendingWorkItem`, new WorkItemDto());
    }

    public cancelCreate(): void {
        store.commit(`${workItemKey}/setPendingWorkItem`, null);
    }

    public confirmCreate(): void {
        store.dispatch(`${workItemKey}/createWorkItem`);
    }

    public onSearch(text: string): void {
        this.query.searchText = text;
        store.dispatch(`${workItemKey}/loadWorkItems`, this.query);
    }
}
</script>

<style lang="scss" scoped>
.work-items-management-container {

    .actions, .content {
        width: 100%;
        height: 100%;
    }

    .actions {
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 7.5vh 0 2.5vh;

        .search-box {
            width: 40%;
            height: 80%;
        }

        .filter-group {
            height: 80%;
        }
    }

    .content {
        display: flex;
        align-items: center;
        justify-content: center;

        .work-items-list {
            width: 65%;
            height: 95%;
        }
    }
}
</style>
