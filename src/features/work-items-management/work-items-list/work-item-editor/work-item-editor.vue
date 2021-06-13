<template>
    <display-panel v-if="meta && item"
        class="work-item-editor-container"
        :lineLength="'1vh'"
        :corners="[false, false, true, true]">

        <close class="close-button" @click="$emit('item:close')" />

        <detail-display-panel class="content">
            <div class="core-information">
                <div class="icons">
                    <span>{{ item.priority }}</span>
                    <span>{{ item.type }}</span>
                </div>

                <estimation-selector class="estimation"
                    v-model="item.estimatedHours"
                    :options="estimationOptions"
                    :transform="_ => `${_} hr${_ > 1 ? 's' : ''}`">
                </estimation-selector>

                <span class="name">{{ item.name }}</span>
            </div>

            <div class="description">
                <notebook-edit-outline class="icon" />
                <span>{{ item.description ? item.description : 'no description available.' }}</span>
            </div>

            <div class="additional-information">
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
import { Close, FormatListCheckbox, NotebookEditOutline } from 'mdue';

import { WorkItemDto } from '../../../../core/dtos/work-item-dto';
import { WorkItem } from '../../../../core/models/work-item/work-item';
import { ActionButtonType } from '../../../../core/enums/action-button-type.enum';
import ActionButton from '../../../../shared/buttons/action-button.vue';
import EstimationSelector from '../../../../shared/inputs/estimation-selector.vue';
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
        EstimationSelector,
        DisplayPanel,
        DetailDisplayPanel,
        ItemProgression
    },
    emits: [
        'item:close',
        'item:delete',
    ]
})
export default class WorkItemEditor extends Vue.with(WorkItemEditorProp) {
    public readonly buttonType = ActionButtonType;
    public readonly estimationOptions = [0.2, 0.5, 1, 2, 3, 5, 8, 13, 21];

    get checklistIcon(): any {
        return markRaw(FormatListCheckbox);
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
            $name-font-size: var(--font-sizes-500);

            display: flex;
            align-items: center;
            width: 100%;
            height: 20%;

            .icons {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-left: 2.5%;
                width: 5%;
            }

            .estimation {
                width: 10%;
                height: calc(#{$name-font-size} * 1.75);
                text-align: center;
                font-size: var(--font-sizes-500);
            }

            .name {
                margin-left: 1.5%;
                font-size: $name-font-size;
            }
        }

        .description {
            box-sizing: border-box;
            display: flex;
            flex: 1;
            padding: 1.5vh 0;
            width: 80%;

            .icon {
                margin-right: 1vh;
                color: var(--font-colors-1-00);
                font-size: var(--font-sizes-700);
            }

            span {
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
