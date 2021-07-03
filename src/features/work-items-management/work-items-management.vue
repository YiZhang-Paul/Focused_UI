<template>
    <content-view-panel class="work-items-management-container">
        <template v-slot:actions>
            <div class="actions">
                <creation-button @click="startCreate()"></creation-button>
                <search-box class="search-box" @search="onSearch($event)"></search-box>

                <segmented-control class="filter-group"
                    :title="'completed'"
                    :options="completionFilterOptions"
                    @select="onCompletionFilter()">
                </segmented-control>

                <segmented-control class="filter-group"
                    :title="'highlighted'"
                    :options="highlightFilterOptions"
                    @select="onHighlightFilter()">
                </segmented-control>

                <segmented-control class="filter-group"
                    :title="'work item type'"
                    :options="typeFilterOptions"
                    @select="onTypeFilter()">
                </segmented-control>
            </div>
        </template>

        <div class="content">
            <work-item-tracking-stats-group class="stats-group"></work-item-tracking-stats-group>

            <display-panel class="core-content" :lineLength="'1.25vh'">
                <session-tracker class="session-tracker"></session-tracker>

                <work-item-editor v-if="editedItemMeta && editedItem"
                    class="work-item-editor"
                    :meta="editedItemMeta"
                    :item="editedItem"
                    @item:close="onItemClose()"
                    @item:update="onItemUpdate(editedItem)"
                    @item:delete="onItemDelete(editedItem.id)">
                </work-item-editor>

                <work-items-list v-if="!editedItem"
                    class="work-items-list"
                    :pendingItem="pendingItem"
                    :editedItem="editedItem"
                    @create:cancel="cancelCreate()"
                    @create:confirm="confirmCreate()"
                    @update:meta="onItemMetaUpdate($event)"
                    @item:select="onItemSelect($event.id)"
                    @item:start="onItemStart($event)"
                    @item:stop="onItemStop()">
                </work-items-list>
            </display-panel>

            <work-item-progress-stats-group class="stats-group"></work-item-progress-stats-group>
        </div>
    </content-view-panel>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import { workItemKey } from '../../store/work-item/work-item.state';
import { WorkItemDto } from '../../core/dtos/work-item-dto';
import { WorkItem } from '../../core/models/work-item/work-item';
import { WorkItemQuery } from '../../core/models/work-item/work-item-query';
import { ControlButtonOption } from '../../core/models/generic/control-button-option';
import { GenericFilterType } from '../../core/enums/generic-filter-type.enum';
import { WorkItemType } from '../../core/enums/work-item-type.enum';
import { IconUtility } from '../../core/utilities/icon-utility/icon-utility';
import SearchBox from '../../shared/inputs/search-box/search-box.vue';
import SegmentedControl from '../../shared/inputs/segmented-control/segmented-control.vue';
import CreationButton from '../../shared/buttons/creation-button/creation-button.vue';
import DisplayPanel from '../../shared/panels/display-panel/display-panel.vue';
import ContentViewPanel from '../../shared/panels/content-view-panel/content-view-panel.vue';
import SessionTracker from '../../shared/widgets/session-tracker/session-tracker.vue';
import StatsBreakdown from '../../shared/widgets/stats-breakdown/stats-breakdown.vue';

import WorkItemTrackingStatsGroup from './work-item-tracking-stats-group/work-item-tracking-stats-group.vue';
import WorkItemProgressStatsGroup from './work-item-progress-stats-group/work-item-progress-stats-group.vue';
import WorkItemEditor from './work-item-editor/work-item-editor.vue';
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
        WorkItemEditor,
        WorkItemsList
    },
    emits: [
        'item:update',
        'item:delete'
    ]
})
export default class WorkItemsManagement extends Vue {
    public readonly completionFilterOptions = [
        new ControlButtonOption(IconUtility.getGenericFilterIcon(GenericFilterType.All), true),
        new ControlButtonOption(IconUtility.getGenericFilterIcon(GenericFilterType.Yes)),
        new ControlButtonOption(IconUtility.getGenericFilterIcon(GenericFilterType.No))
    ];

    public readonly highlightFilterOptions = [
        new ControlButtonOption(IconUtility.getGenericFilterIcon(GenericFilterType.All), true),
        new ControlButtonOption(IconUtility.getGenericFilterIcon(GenericFilterType.Yes)),
        new ControlButtonOption(IconUtility.getGenericFilterIcon(GenericFilterType.No))
    ];

    public readonly typeFilterOptions = [
        new ControlButtonOption(IconUtility.getGenericFilterIcon(GenericFilterType.All), true),
        new ControlButtonOption(IconUtility.getWorkItemIcon(WorkItemType.Regular)),
        new ControlButtonOption(IconUtility.getWorkItemIcon(WorkItemType.Recurring)),
        new ControlButtonOption(IconUtility.getWorkItemIcon(WorkItemType.Interruption))
    ];

    private query = new WorkItemQuery();

    get pendingItem(): WorkItemDto | null {
        return this.$store.getters[`${workItemKey}/pendingWorkItem`];
    }

    get editedItemMeta(): WorkItemDto | null {
        return this.$store.getters[`${workItemKey}/editedWorkItemMeta`];
    }

    get editedItem(): WorkItem | null {
        return this.$store.getters[`${workItemKey}/editedWorkItem`];
    }

    public created(): void {
        this.loadWorkItems();
    }

    public startCreate(): void {
        this.$store.commit(`${workItemKey}/setPendingWorkItem`, new WorkItemDto());
    }

    public cancelCreate(): void {
        this.$store.commit(`${workItemKey}/setPendingWorkItem`, null);
    }

    public async confirmCreate(): Promise<void> {
        const id = await this.$store.dispatch(`${workItemKey}/createWorkItem`);

        if (id) {
            await this.onItemSelect(id);
            await this.loadWorkItems();
        }
    }

    public async onItemMetaUpdate(item: WorkItemDto): Promise<void> {
        if (await this.$store.dispatch(`${workItemKey}/updateWorkItemMeta`, item)) {
            this.$emit('item:update');
        }
    }

    public onItemClose(): void {
        this.$store.commit(`${workItemKey}/setEditedWorkItem`, null);
    }

    public async onItemUpdate(item: WorkItem): Promise<void> {
        if (await this.$store.dispatch(`${workItemKey}/updateWorkItem`, item)) {
            this.$emit('item:update');
        }
    }

    public async onItemDelete(id: string): Promise<void> {
        if (await this.$store.dispatch(`${workItemKey}/deleteWorkItem`, id)) {
            this.$emit('item:delete');
        }
    }

    public async onItemSelect(id: string): Promise<void> {
        await this.$store.dispatch(`${workItemKey}/loadEditedWorkItem`, id);
    }

    public async onItemStart(id: string): Promise<void> {
        if (await this.$store.dispatch(`${workItemKey}/startWorkItem`, id)) {
            this.$emit('item:update');
        }
    }

    public async onItemStop(): Promise<void> {
        if (await this.$store.dispatch(`${workItemKey}/stopWorkItem`)) {
            this.$emit('item:update');
        }
    }

    public onSearch(text: string): void {
        this.query.searchText = text;
        this.loadWorkItems();
    }

    public onCompletionFilter(): void {
        if (this.completionFilterOptions[1].isActive) {
            this.query.isCompleted = true;
            this.resetHighlightFilter();
        }
        else {
            this.query.isCompleted = this.completionFilterOptions[0].isActive ? undefined : false;
        }

        this.loadWorkItems();
    }

    public onHighlightFilter(): void {
        if (this.highlightFilterOptions[1].isActive) {
            this.query.isHighlighted = true;
            this.resetCompletionFilter();
        }
        else {
            this.query.isHighlighted = this.highlightFilterOptions[0].isActive ? undefined : false;
        }

        this.loadWorkItems();
    }

    public onTypeFilter(): void {
        const types = [
            undefined,
            WorkItemType.Regular,
            WorkItemType.Recurring,
            WorkItemType.Interruption
        ];

        const index = this.typeFilterOptions.findIndex(_ => _.isActive);
        this.query.type = types[index];
        this.loadWorkItems();
    }

    private resetCompletionFilter(): void {
        this.query.isCompleted = undefined;
        this.completionFilterOptions.forEach((_, index) => _.isActive = !index);
    }

    private resetHighlightFilter(): void {
        this.query.isHighlighted = undefined;
        this.highlightFilterOptions.forEach((_, index) => _.isActive = !index);
    }

    private async loadWorkItems(): Promise<void> {
        await this.$store.dispatch(`${workItemKey}/loadWorkItems`, this.query);
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
            align-items: center;
            justify-content: space-between;
            padding: 2.5vh 3.5vh;
            width: $core-content-width;
            background-color: var(--primary-colors-8-01);

            .session-tracker {
                width: 100%;
                height: $tracker-height;
            }

            .work-item-editor, .work-items-list {
                height: calc(100% - 1.5vh - #{$tracker-height});
            }

            .work-item-editor {
                width: 92.5%;
            }

            .work-items-list {
                width: 100%;
            }
        }
    }
}
</style>
