<template>
    <display-panel v-if="meta && item" class="work-item-editor-header-container">
        <div class="selectors">
            <icon-value-selector class="priority"
                v-model="item.priority"
                :options="priorityOptions"
                @update:modelValue="$emit('item:update')">
            </icon-value-selector>

            <div class="separator"></div>

            <icon-value-selector class="type"
                v-model="item.type"
                :options="typeOptions"
                @update:modelValue="onTypeChange()">
            </icon-value-selector>

            <div class="separator"></div>

            <estimation-selector class="estimation"
                v-model="item.estimatedHours"
                :options="estimationOptions"
                :transform="_ => `${_} hour${_ > 1 ? 's' : ''}`"
                @update:modelValue="$emit('item:update')">
            </estimation-selector>
        </div>

        <due-time-display class="due-time" :date="item.dueDate"></due-time-display>
        <item-completion-progress class="item-progress" :progress="meta.itemProgress"></item-completion-progress>
    </display-panel>
</template>

<script lang="ts">
import { markRaw } from 'vue';
import { Options, Vue, prop } from 'vue-class-component';
import { AlertCircle } from 'mdue';

import { WorkItemDto } from '../../../../core/dtos/work-item-dto';
import { WorkItem } from '../../../../core/models/work-item/work-item';
import { IconSelectionOption } from '../../../../core/models/generic/icon-selection-option';
import { WorkItemPriority } from '../../../../core/enums/work-item-priority.enum';
import { WorkItemType } from '../../../../core/enums/work-item-type.enum';
import { IconUtility } from '../../../../core/utilities/icon-utility/icon-utility';
import IconValueSelector from '../../../../shared/inputs/icon-value-selector/icon-value-selector.vue';
import EstimationSelector from '../../../../shared/inputs/estimation-selector/estimation-selector.vue';
import DueTimeDisplay from '../../../../shared/displays/due-time-display/due-time-display.vue';
import DisplayPanel from '../../../../shared/panels/display-panel/display-panel.vue';
import ItemCompletionProgress from '../../../../shared/widgets/item-completion-progress/item-completion-progress.vue';

class WorkItemEditorHeaderProp {
    public meta = prop<WorkItemDto>({ default: null });
    public item = prop<WorkItem>({ default: null });
}

@Options({
    components: {
        IconValueSelector,
        EstimationSelector,
        DueTimeDisplay,
        DisplayPanel,
        ItemCompletionProgress
    },
    emits: ['item:update']
})
/* istanbul ignore next */
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
                description: setting.name!,
                value: _
            };
        });
    }

    public onTypeChange(): void {
        if (this.item.type !== WorkItemType.Regular) {
            this.item.dueDate = undefined;
        }

        this.$emit('item:update');
    }
}
</script>

<style lang="scss" scoped>
.work-item-editor-header-container {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--primary-colors-8-03);

    .selectors {
        z-index: 1;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        left: 0;
        width: 17.5%;
        height: 60%;

        .priority, .type, .estimation, .separator {
            opacity: 0;
            animation: fade-in 0.3s ease forwards;
        }

        .priority {
            animation-delay: 0.3s;
        }

        .type {
            animation-delay: 0.4s;
        }

        .separator {
            width: 1px;
            height: 55%;
            background-color: var(--font-colors-6-00);
            animation-delay: 0.8s;
        }

        .estimation {
            font-size: var(--font-sizes-500);
            animation-delay: 0.5s;
        }
    }

    .due-time, .item-progress {
        opacity: 0;
        animation: fade-in 0.2s ease 0.4s forwards;
    }

    .item-progress {
        position: absolute;
        right: 1.5%;
        width: 22.5%;
        height: 42.5%;
    }
}
</style>
