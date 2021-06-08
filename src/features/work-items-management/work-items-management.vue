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
            <div class="stats-group">
                <stats-breakdown v-if="activityBreakdown"
                    class="breakdown"
                    :title="'total time spent'"
                    :content="totalTimeSpent"
                    :series="totalTimeSpentSeries">
                </stats-breakdown>
            </div>

            <work-items-list class="work-items-list"
                :pendingItem="pendingItem"
                @create:cancel="cancelCreate()"
                @create:confirm="confirmCreate()"
                @update:meta="onItemMetaUpdate($event)">
            </work-items-list>

            <div class="stats-group"></div>
        </div>
    </content-view-panel>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../store';
import { performanceKey } from '../../store/performance/performance.state';
import { workItemKey } from '../../store/work-item/work-item.state';
import { ActivityBreakdownDto } from '../../core/dtos/activity-breakdown-dto';
import { WorkItemDto } from '../../core/dtos/work-item-dto';
import { WorkItemQuery } from '../../core/models/work-item/work-item-query';
import { PercentageSeries } from '../../core/models/progress-bar/percentage-series';
import { GenericFilterType } from '../../core/enums/generic-filter-type.enum';
import { WorkItemType } from '../../core/enums/work-item-type.enum';
import { IconUtility } from '../../core/utilities/icon-utility/icon-utility';
import SearchBox from '../../shared/inputs/search-box.vue';
import SegmentedControl from '../../shared/inputs/segmented-control.vue';
import CreationButton from '../../shared/buttons/creation-button.vue';
import ContentViewPanel from '../../shared/panels/content-view-panel.vue';
import StatsBreakdown from '../../shared/widgets/stats-breakdown.vue';

import WorkItemsList from './work-items-list/work-items-list.vue';

@Options({
    components: {
        SearchBox,
        SegmentedControl,
        CreationButton,
        ContentViewPanel,
        StatsBreakdown,
        WorkItemsList
    }
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

    get activityBreakdown(): ActivityBreakdownDto | null {
        return store.getters[`${performanceKey}/activityBreakdown`];
    }

    get totalTimeSpent(): string {
        const { regular, recurring, interruption, overlearning } = this.activityBreakdown!;
        const days = (regular + recurring + interruption + overlearning) / 24;
        const total = days ? days.toFixed(1) : '0';

        return `${total} day${days > 1 ? 's' : ''}`;
    }

    get totalTimeSpentSeries(): PercentageSeries[] {
        const { regular, recurring, interruption, overlearning } = this.activityBreakdown!;
        const total = regular + recurring + interruption + overlearning;

        return [
            { percent: interruption / total * 100, colorType: 'activity-colors-interruption' },
            { percent: regular / total * 100, colorType: 'activity-colors-regular' },
            { percent: recurring / total * 100, colorType: 'activity-colors-recurring' },
            { percent: overlearning / total * 100, colorType: 'activity-colors-overlearning' }
        ];
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
        if (await store.dispatch(`${workItemKey}/createWorkItem`)) {
            await this.loadWorkItems();
        }
    }

    public onItemMetaUpdate(item: WorkItemDto): void {
        store.dispatch(`${workItemKey}/updateWorkItemMeta`, item);
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
        $gap: 6%;
        $list-width: 62.5%;

        display: flex;
        align-items: center;
        justify-content: space-evenly;

        .stats-group, .work-items-list {
            height: 95%;
        }

        .stats-group {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: calc((100% - #{$gap} - #{$list-width}) / 2);

            .breakdown {
                width: 100%;
                height: 8.5vh;
            }
        }

        .work-items-list {
            width: $list-width;
        }
    }
}
</style>
