<template>
    <display-panel v-if="meta && item"
        class="work-item-editor-container"
        :lineLength="'1vh'"
        :corners="[false, false, true, true]">

        <close class="close-button" @click="$emit('item:close')" />

        <detail-display-panel class="content">
            <div class="core-information">
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

                <text-input class="name"
                    v-model="item.name"
                    @update:modelValue="$emit('item:update')">
                </text-input>
            </div>

            <div class="description">
                <notebook-edit-outline class="icon" />

                <textarea-input class="description-input"
                    v-model="item.description"
                    @update:modelValue="$emit('item:update')">
                </textarea-input>
            </div>

            <div class="additional-information">
                <div class="due-date" v-if="!isRecur">
                    <span>Due</span>
                    <date-selector></date-selector>
                </div>

                <div class="completion-information">
                    <item-progression :progress="meta.subtaskProgress"></item-progression>
                    <item-progression :icon="checklistIcon" :progress="meta.checklistProgress"></item-progression>
                </div>
            </div>
        </detail-display-panel>

        <div class="footer">
            <action-button class="delete-button"
                :text="'delete'"
                :type="buttonType.Warning"
                @click="$emit('item:delete', item)">
            </action-button>

            <div class="creation-time">
                <span>
                    created on:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {{ getTime(item.timeInfo.created) }}
                </span>

                <span>
                    last modified:&nbsp;&nbsp;
                    {{ getTime(item.timeInfo.lastModified) }}
                </span>
            </div>
        </div>
    </display-panel>
</template>

<script lang="ts">
import { markRaw } from 'vue';
import { Options, Vue, prop } from 'vue-class-component';
import { AlertCircle, Close, FormatListCheckbox, NotebookEditOutline } from 'mdue';

import { WorkItemDto } from '../../../../core/dtos/work-item-dto';
import { WorkItem } from '../../../../core/models/work-item/work-item';
import { IconSelectionOption } from '../../../../core/models/generic/icon-selection-option';
import { WorkItemPriority } from '../../../../core/enums/work-item-priority.enum';
import { WorkItemType } from '../../../../core/enums/work-item-type.enum';
import { ActionButtonType } from '../../../../core/enums/action-button-type.enum';
import { IconUtility } from '../../../../core/utilities/icon-utility/icon-utility';
import ActionButton from '../../../../shared/buttons/action-button.vue';
import TextInput from '../../../../shared/inputs/text-input.vue';
import TextareaInput from '../../../../shared/inputs/textarea-input.vue';
import IconValueSelector from '../../../../shared/inputs/icon-value-selector.vue';
import EstimationSelector from '../../../../shared/inputs/estimation-selector.vue';
import DateSelector from '../../../../shared/inputs/date-selector.vue';
import DisplayPanel from '../../../../shared/panels/display-panel.vue';
import DetailDisplayPanel from '../../../../shared/panels/detail-display-panel.vue';
import ItemProgression from '../../../../shared/displays/item-progression.vue';

class WorkItemEditorProp {
    public meta = prop<WorkItemDto>({ default: null });
    public item = prop<WorkItem>({ default: null });
}

@Options({
    components: {
        Close,
        NotebookEditOutline,
        ActionButton,
        TextInput,
        TextareaInput,
        IconValueSelector,
        EstimationSelector,
        DateSelector,
        DisplayPanel,
        DetailDisplayPanel,
        ItemProgression
    },
    emits: [
        'item:close',
        'item:update',
        'item:delete'
    ]
})
export default class WorkItemEditor extends Vue.with(WorkItemEditorProp) {
    public readonly buttonType = ActionButtonType;
    public readonly estimationOptions = [0.2, 0.5, 1, 2, 3, 5, 8, 13, 21];
    public readonly types = [WorkItemType.Regular, WorkItemType.Recurring, WorkItemType.Interruption];

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

    get isRecur(): boolean {
        return this.item.type === WorkItemType.Recurring;
    }

    get checklistIcon(): any {
        return markRaw(FormatListCheckbox);
    }

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

    public getTime(time: string): string {
        if (!time) {
            return '';
        }

        return new Date(time).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    }
}
</script>

<style lang="scss" scoped>
.work-item-editor-container {
    $content-height: 75%;

    position: relative;
    box-sizing: border-box;
    padding: 3.5% 8.75% 0 8.75%;
    background: linear-gradient(
        269.98deg,
        var(--primary-colors-7-02) 0.02%,
        var(--primary-colors-7-01) 99.98%
    );

    .close-button {
        position: absolute;
        top: 2.75vh;
        right: 2.75vh;
        color: var(--primary-colors-2-00);
        font-size: var(--font-sizes-600);
        transition: color 0.3s;

        &:hover {
            cursor: pointer;
            color: var(--context-colors-warning-00);
        }
    }

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: $content-height;

        .core-information {
            $font-size: var(--font-sizes-500);

            display: flex;
            align-items: center;
            width: 100%;
            height: 20%;

            .selectors {
                display: flex;
                align-items: center;
                justify-content: space-evenly;
                width: 17.5%;
                height: 50%;

                .separator {
                    width: 1px;
                    height: 55%;
                    background-color: var(--font-colors-6-00);
                }

                .estimation {
                    font-size: $font-size;
                }
            }

            .name {
                margin-left: 1%;
                flex: 1;
                font-size: $font-size;
            }
        }

        .description {
            box-sizing: border-box;
            display: flex;
            padding: 1.5vh 0;
            width: 80%;
            height: 67.5%;

            .icon {
                margin-right: 1vh;
                color: var(--font-colors-1-00);
                font-size: var(--font-sizes-700);
            }

            .description-input {
                flex: 1;
                color: var(--font-colors-2-00);
            }
        }

        .additional-information {
            position: relative;
            display: flex;
            align-items: center;
            width: 100%;
            height: 12.5%;

            .due-date {
                display: flex;
                align-items: center;

                & > span {
                    margin-right: 0.75vh;
                }
            }

            .completion-information {
                position: absolute;
                display: flex;
                align-items: center;
                justify-content: space-between;
                right: 2.5vh;
                width: 12.5%;
            }
        }
    }

    .footer {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: calc(100% - #{$content-height});

        .delete-button {
            position: absolute;
        }

        .creation-time {
            display: flex;
            flex-direction: column;
            position: absolute;
            right: 0.5vh;
            font-size: var(--font-sizes-300);

            span {
                color: var(--font-colors-0-05);
            }

            span:first-of-type {
                margin-bottom: 0.5vh;
            }
        }
    }
}
</style>
