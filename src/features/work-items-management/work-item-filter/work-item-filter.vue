<template>
    <div class="work-item-filter-container">
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

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import { WorkItemQuery } from '../../../core/models/work-item/work-item-query';
import { ControlButtonOption } from '../../../core/models/generic/control-button-option';
import { GenericFilterType } from '../../../core/enums/generic-filter-type.enum';
import { WorkItemType } from '../../../core/enums/work-item-type.enum';
import { IconUtility } from '../../../core/utilities/icon-utility/icon-utility';
import SearchBox from '../../../shared/inputs/search-box/search-box.vue';
import SegmentedControl from '../../../shared/inputs/segmented-control/segmented-control.vue';

class WorkItemFilterProp {
    public query = prop<WorkItemQuery>({ default: new WorkItemQuery() });
}

@Options({
    components: {
        SearchBox,
        SegmentedControl
    },
    emits: ['item:filter']
})
export default class WorkItemFilter extends Vue.with(WorkItemFilterProp) {
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

    public onSearch(text: string): void {
        this.query.searchText = text;
        this.$emit('item:filter', this.query);
    }

    public onCompletionFilter(): void {
        if (this.completionFilterOptions[1].isActive) {
            this.query.isCompleted = true;
            this.resetHighlightFilter();
        }
        else {
            this.query.isCompleted = this.completionFilterOptions[0].isActive ? undefined : false;
        }

        this.$emit('item:filter', this.query);
    }

    public onHighlightFilter(): void {
        if (this.highlightFilterOptions[1].isActive) {
            this.query.isHighlighted = true;
            this.resetCompletionFilter();
        }
        else {
            this.query.isHighlighted = this.highlightFilterOptions[0].isActive ? undefined : false;
        }

        this.$emit('item:filter', this.query);
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
        this.$emit('item:filter', this.query);
    }

    private resetCompletionFilter(): void {
        this.query.isCompleted = undefined;
        this.completionFilterOptions.forEach((_, index) => _.isActive = !index);
    }

    private resetHighlightFilter(): void {
        this.query.isHighlighted = undefined;
        this.highlightFilterOptions.forEach((_, index) => _.isActive = !index);
    }
}
</script>

<style lang="scss" scoped>
.work-item-filter-container {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .search-box {
        width: 35%;
        height: 100%;
    }

    .filter-group {
        height: 100%;
    }
}
</style>
