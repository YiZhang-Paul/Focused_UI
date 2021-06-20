<template>
    <content-view-panel class="work-items-management-container">
        <template v-slot:actions>
            <div class="actions">
                <creation-button @click="startCreate()"></creation-button>
                <search-box class="search-box" @search="onSearch($event)"></search-box>

                <segmented-control class="filter-group"
                    :title="'completed'"
                    :options="genericFilterOptions"
                    @select="onCompletionFilter($event.name)">
                </segmented-control>

                <segmented-control class="filter-group"
                    :title="'highlighted'"
                    :options="genericFilterOptions"
                    @select="onHighlightFilter($event.name)">
                </segmented-control>

                <segmented-control class="filter-group"
                    :title="'work item type'"
                    :options="typeFilterOptions"
                    @select="onTypeFilter($event.name)">
                </segmented-control>
            </div>
        </template>

        <div class="content">
            <work-item-tracking-stats-group class="stats-group"></work-item-tracking-stats-group>

            <display-panel class="core-content" :lineLength="'1.25vh'">
                <session-tracker class="session-tracker"></session-tracker>

                <work-items-list class="work-items-list"
                    :pendingItem="pendingItem"
                    :editedItem="editedItem"
                    @create:cancel="cancelCreate()"
                    @create:confirm="confirmCreate()"
                    @update:meta="onItemMetaUpdate($event)"
                    @item:close="onItemClose()"
                    @item:update="onItemUpdate($event)"
                    @item:delete="onItemDelete($event.id)"
                    @item:select="onItemSelect($event.id)">
                </work-items-list>
            </display-panel>

            <work-item-progress-stats-group class="stats-group"></work-item-progress-stats-group>
        </div>
    </content-view-panel>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../store';
import { workItemKey } from '../../store/work-item/work-item.state';
import { WorkItemDto } from '../../core/dtos/work-item-dto';
import { WorkItem } from '../../core/models/work-item/work-item';
import { WorkItemQuery } from '../../core/models/work-item/work-item-query';
import { GenericFilterType } from '../../core/enums/generic-filter-type.enum';
import { WorkItemType } from '../../core/enums/work-item-type.enum';
import { IconUtility } from '../../core/utilities/icon-utility/icon-utility';
import SearchBox from '../../shared/inputs/search-box.vue';
import SegmentedControl from '../../shared/inputs/segmented-control.vue';
import CreationButton from '../../shared/buttons/creation-button.vue';
import DisplayPanel from '../../shared/panels/display-panel.vue';
import ContentViewPanel from '../../shared/panels/content-view-panel.vue';
import SessionTracker from '../../shared/widgets/session-tracker.vue';
import StatsBreakdown from '../../shared/widgets/stats-breakdown.vue';

import WorkItemTrackingStatsGroup from './work-item-tracking-stats-group/work-item-tracking-stats-group.vue';
import WorkItemProgressStatsGroup from './work-item-progress-stats-group/work-item-progress-stats-group.vue';
import WorkItemsList from './work-items-list/work-items-list.vue';

@Options({
    components: {
        SearchBox,
        SegmentedControl,
        CreationButton,
        DisplayPanel,
        ContentViewPanel,
        SessionTracker,
        StatsBreakdown,
        WorkItemTrackingStatsGroup,
        WorkItemProgressStatsGroup,
        WorkItemsList
    },
    emits: [
        'item:update',
        'item:delete'
    ]
})
export default class WorkItemsManagement extends Vue {
    public readonly genericFilterOptions = [
        IconUtility.getGenericFilterIcon(GenericFilterType.All),
        IconUtility.getGenericFilterIcon(GenericFilterType.Yes),
        IconUtility.getGenericFilterIcon(GenericFilterType.No)
    ];

    public readonly typeFilterOptions = [
        IconUtility.getGenericFilterIcon(GenericFilterType.All),
        IconUtility.getWorkItemIcon(WorkItemType.Regular),
        IconUtility.getWorkItemIcon(WorkItemType.Recurring),
        IconUtility.getWorkItemIcon(WorkItemType.Interruption)
    ];

    private query = new WorkItemQuery();

    get pendingItem(): WorkItemDto | null {
        return store.getters[`${workItemKey}/pendingWorkItem`];
    }

    get editedItem(): WorkItem | null {
        return store.getters[`${workItemKey}/editedWorkItem`];
    }

    public created(): void {
        this.loadWorkItems();
    }

    public startCreate(): void {
        store.commit(`${workItemKey}/setPendingWorkItem`, new WorkItemDto());
    }

    public cancelCreate(): void {
        store.commit(`${workItemKey}/setPendingWorkItem`, null);
    }

    public async confirmCreate(): Promise<void> {
        const id = await store.dispatch(`${workItemKey}/createWorkItem`);

        if (id) {
            await this.onItemSelect(id);
            await this.loadWorkItems();
        }
    }

    public async onItemMetaUpdate(item: WorkItemDto): Promise<void> {
        if (await store.dispatch(`${workItemKey}/updateWorkItemMeta`, item)) {
            this.$emit('item:update');
        }
    }

    public onItemClose(): void {
        store.commit(`${workItemKey}/setEditedWorkItem`, null);
    }

    public async onItemUpdate(item: WorkItem): Promise<void> {
        if (await store.dispatch(`${workItemKey}/updateWorkItem`, item)) {
            this.$emit('item:update');
        }
    }

    public async onItemDelete(id: string): Promise<void> {
        if (await store.dispatch(`${workItemKey}/deleteWorkItem`, id)) {
            this.$emit('item:delete');
        }
    }

    public async onItemSelect(id: string): Promise<void> {
        await store.dispatch(`${workItemKey}/loadEditedWorkItem`, id);
    }

    public onSearch(text: string): void {
        this.query.searchText = text;
        this.loadWorkItems();
    }

    public onCompletionFilter(name: string): void {
        if (name === this.genericFilterOptions[0].name) {
            this.query.isCompleted = undefined;
        }
        else {
            this.query.isCompleted = name === this.genericFilterOptions[1].name;
        }

        this.loadWorkItems();
    }

    public onHighlightFilter(name: string): void {
        if (name === this.genericFilterOptions[0].name) {
            this.query.isHighlighted = undefined;
        }
        else {
            this.query.isHighlighted = name === this.genericFilterOptions[1].name;
        }

        this.loadWorkItems();
    }

    public onTypeFilter(name: string): void {
        const types = [
            undefined,
            WorkItemType.Regular,
            WorkItemType.Recurring,
            WorkItemType.Interruption
        ];

        const index = this.typeFilterOptions.findIndex(_ => name === _.name);
        this.query.type = types[index];
        this.loadWorkItems();
    }

    private async loadWorkItems(): Promise<void> {
        await store.dispatch(`${workItemKey}/loadWorkItems`, this.query);
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
            width: 35%;
            height: 80%;
        }

        .filter-group {
            height: 80%;
        }
    }

    .content {
        $gap: 5%;
        $core-content-width: 63.5%;

        display: flex;
        align-items: center;
        justify-content: space-evenly;

        .stats-group, .core-content {
            height: 95%;
        }

        .stats-group {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: calc((100% - #{$gap} - #{$core-content-width}) / 2);
        }

        .core-content {
            $tracker-height: 5.5vh;

            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 2.5vh 3.5vh;
            width: $core-content-width;
            background-color: var(--primary-colors-8-01);

            .session-tracker {
                width: 100%;
                height: $tracker-height;
            }

            .work-items-list {
                width: 100%;
                height: calc(100% - 1.5vh - #{$tracker-height});
            }
        }
    }
}
</style>
