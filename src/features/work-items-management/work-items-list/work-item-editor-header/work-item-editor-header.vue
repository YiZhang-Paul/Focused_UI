<template>
    <div class="work-item-editor-header-container">
        <display-panel class="selectors">
            <icon-value-selector v-model="item.priority"
                :options="priorityOptions"
                @update:modelValue="$emit('item:update')">
            </icon-value-selector>

            <div class="separator"></div>

            <icon-value-selector v-model="item.type"
                :options="typeOptions"
                @update:modelValue="$emit('item:update')">
            </icon-value-selector>

            <div class="separator"></div>

            <estimation-selector class="estimation"
                v-model="item.estimatedHours"
                :options="estimationOptions"
                :transform="_ => `${_} hr${_ > 1 ? 's' : ''}`"
                @update:modelValue="$emit('item:update')">
            </estimation-selector>
        </display-panel>
    </div>
</template>

<script lang="ts">
import { markRaw } from 'vue';
import { Options, Vue, prop } from 'vue-class-component';
import { AlertCircle } from 'mdue';

import { WorkItem } from '../../../../core/models/work-item/work-item';
import { IconSelectionOption } from '../../../../core/models/generic/icon-selection-option';
import { WorkItemPriority } from '../../../../core/enums/work-item-priority.enum';
import { WorkItemType } from '../../../../core/enums/work-item-type.enum';
import { IconUtility } from '../../../../core/utilities/icon-utility/icon-utility';
import IconValueSelector from '../../../../shared/inputs/icon-value-selector.vue';
import EstimationSelector from '../../../../shared/inputs/estimation-selector.vue';
import DisplayPanel from '../../../../shared/panels/display-panel.vue';

class WorkItemEditorHeaderProp {
    public item = prop<WorkItem>({ default: null });
}

@Options({
    components: {
        IconValueSelector,
        EstimationSelector,
        DisplayPanel
    },
    emits: ['item:update']
})
export default class WorkItemEditorHeader extends Vue.with(WorkItemEditorHeaderProp) {
    public readonly types = [WorkItemType.Regular, WorkItemType.Recurring, WorkItemType.Interruption];
    public readonly estimationOptions = [0.2, 0.5, 1, 2, 3, 5, 8, 13, 21];

    public readonly priorityOptions: IconSelectionOption<WorkItemPriority>[] = [
        {
            icon: markRaw(AlertCircle),
            colorType: 'priority-colors-0',
            description: 'urgent important',
            value: WorkItemPriority.UrgentImportant
        },
        {
            icon: markRaw(AlertCircle),
            colorType: 'priority-colors-1',
            description: 'important not urgent',
            value: WorkItemPriority.ImportantNotUrgent
        },
        {
            icon: markRaw(AlertCircle),
            colorType: 'priority-colors-2',
            description: 'urgent not important',
            value: WorkItemPriority.UrgentNotImportant
        },
        {
            icon: markRaw(AlertCircle),
            colorType: 'priority-colors-3',
            description: 'not urgent not important',
            value: WorkItemPriority.NotUrgentNotImportant
        }
    ];

    get typeOptions(): IconSelectionOption<WorkItemType>[] {
        return this.types.map(_ => {
            const setting = IconUtility.getWorkItemIcon(_);

            return {
                icon: setting.content,
                colorType: `activity-colors-${setting.name}`,
                description: setting.name,
                value: _
            };
        });
    }
}
</script>

<style lang="scss" scoped>
.work-item-editor-header-container {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    background-color: var(--primary-colors-8-03);

    .selectors {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        margin-left: 1.25%;
        width: 17.5%;
        height: 60%;

        .separator {
            width: 1px;
            height: 55%;
            background-color: var(--font-colors-6-00);
        }

        .estimation {
            font-size: var(--font-sizes-500);
        }
    }
}
</style>
