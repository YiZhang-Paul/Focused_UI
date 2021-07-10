<template>
    <div class="work-item-editor-container" v-if="meta && item">
        <work-item-editor-header class="editor-header"
            :meta="meta"
            :item="item"
            @item:update="$emit('item:update')">
        </work-item-editor-header>

        <display-panel class="editor-panel" :lineLength="'1vh'" :corners="[false, false, true, true]">
            <close class="close-button" @click="$emit('item:close')" />

            <detail-display-panel class="content">
                <div class="core-information" v-if="activeIndex === 0">
                    <text-input class="name"
                        v-model="item.name"
                        @update:modelValue="onUpdate()">
                    </text-input>

                    <div class="description">
                        <notebook-edit-outline class="icon" />

                        <textarea-input class="description-input"
                            v-model="item.description"
                            @update:modelValue="onUpdate()">
                        </textarea-input>
                    </div>
                </div>

                <div class="subtask" v-if="activeIndex === 1"></div>

                <work-item-checklist class="checklist"
                    v-if="activeIndex === 2"
                    :entries="item.checklist"
                    @update="onChecklistUpdate($event)">
                </work-item-checklist>

                <div class="additional-information">
                    <div class="due-date" v-if="hasDueDate">
                        <span>Due</span>
                        <date-selector v-model="item.dueDate" @update:modelValue="onUpdate()"></date-selector>
                    </div>

                    <div class="information-tabs">
                        <notebook-edit-outline v-if="activeIndex" class="main-content" @click="activeIndex = 0" />

                        <item-progression class="progression"
                            :class="{ active: activeIndex === 1 }"
                            :progress="meta.subtaskProgress"
                            @click="activeIndex = 1">
                        </item-progression>

                        <item-progression class="progression"
                            :class="{ active: activeIndex === 2 }"
                            :icon="checklistIcon"
                            :progress="meta.checklistProgress"
                            @click="activeIndex = 2">
                        </item-progression>
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
    </div>
</template>

<script lang="ts">
import { markRaw } from 'vue';
import { Options, Vue, prop } from 'vue-class-component';
import { Close, FormatListCheckbox, NotebookEditOutline } from 'mdue';

import { WorkItemDto } from '../../../core/dtos/work-item-dto';
import { WorkItem } from '../../../core/models/work-item/work-item';
import { ChecklistEntry } from '../../../core/models/work-item/checklist-entry';
import { WorkItemType } from '../../../core/enums/work-item-type.enum';
import { ActionButtonType } from '../../../core/enums/action-button-type.enum';
import ActionButton from '../../../shared/buttons/action-button/action-button.vue';
import TextInput from '../../../shared/inputs/text-input/text-input.vue';
import TextareaInput from '../../../shared/inputs/textarea-input/textarea-input.vue';
import DateSelector from '../../../shared/inputs/date-selector/date-selector.vue';
import DisplayPanel from '../../../shared/panels/display-panel/display-panel.vue';
import DetailDisplayPanel from '../../../shared/panels/detail-display-panel/detail-display-panel.vue';
import ItemProgression from '../../../shared/displays/item-progression/item-progression.vue';

import WorkItemEditorHeader from './work-item-editor-header/work-item-editor-header.vue';
import WorkItemChecklist from './work-item-checklist/work-item-checklist.vue';

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
        DateSelector,
        DisplayPanel,
        DetailDisplayPanel,
        ItemProgression,
        WorkItemEditorHeader,
        WorkItemChecklist
    },
    emits: [
        'item:close',
        'item:update',
        'item:delete'
    ]
})
/* istanbul ignore next */
export default class WorkItemEditor extends Vue.with(WorkItemEditorProp) {
    public readonly buttonType = ActionButtonType;
    public readonly checklistIcon = markRaw(FormatListCheckbox);
    public activeIndex = 0;
    // eslint-disable-next-line no-undef
    private debounceTimer: NodeJS.Timeout | null = null;

    get hasDueDate(): boolean {
        return this.item.type === WorkItemType.Regular;
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

    public onChecklistUpdate(entries: ChecklistEntry[]): void {
        this.item.checklist = entries;
        this.onUpdate();
    }

    public onUpdate(): void {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = setTimeout(() => this.$emit('item:update'), 400);
    }
}
</script>

<style lang="scss" scoped>
.work-item-editor-container {
    $card-height: 5vh;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    .editor-header {
        width: 100%;
        height: $card-height;
    }

    .editor-panel {
        $content-height: 75%;

        box-sizing: border-box;
        position: relative;
        padding: 3.5% 8.75% 0 8.75%;
        width: 99%;
        height: calc(100% - #{$card-height} - 10px);
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

            .core-information, .subtask, .checklist {
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
                height: 87.5%;
                opacity: 0;
                animation: fade-in 0.3s ease forwards;
            }

            .core-information {

                .name {
                    margin-top: 2.5vh;
                    margin-bottom: 0.75vh;
                    width: 100%;
                    font-size: var(--font-sizes-500);
                    text-align: center;
                }

                .description {
                    box-sizing: border-box;
                    display: flex;
                    padding: 1.5vh 0;
                    margin-bottom: 1.25vh;
                    width: 80%;
                    height: 75%;

                    .icon {
                        margin-right: 0.75vh;
                        color: var(--font-colors-1-00);
                        font-size: var(--font-sizes-700);
                    }

                    .description-input {
                        width: 100%;
                        height: 100%;
                        color: var(--font-colors-2-00);
                    }
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

                .information-tabs {
                    position: absolute;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    right: 2.5vh;

                    .main-content, .progression {
                        border-radius: 3px;
                        background-color: var(--primary-colors-7-02);
                        transition: background-color 0.3s;

                        &:hover, &.active {
                            cursor: pointer;
                            background-color: var(--primary-colors-7-07);
                        }
                    }

                    .main-content {
                        padding: 0.35vh 0.75vh;
                        color: var(--context-colors-info-00);
                        font-size: var(--font-sizes-500);
                        opacity: 0;
                        animation: fade-in 0.5s ease 0.2s forwards;
                    }

                    .progression {
                        padding: 0.35vh 1vh 0.35vh 0.75vh;

                        &:nth-child(2), &:nth-child(3) {
                            margin-left: 1vh;
                        }
                    }
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
            opacity: 0;
            animation: fade-in 0.2s ease 0.3s forwards;

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
}
</style>
