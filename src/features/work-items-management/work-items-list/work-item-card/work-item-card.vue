<template>
    <div v-if="item"
        class="work-item-card-container"
        @mouseenter="isHovering = true"
        @mouseleave="isHovering = false">

        <div v-if="isHovering" class="hover-layer"></div>
        <div class="priority" :style="priorityStyle"></div>

        <display-panel class="core-information">
            <component :is="typeIcon.content" :style="{ color: typeIcon.color }"></component>
            <div class="separator"></div>
            <span>{{ item.itemProgress.target }}</span>
        </display-panel>

        <span v-if="!isEditMode" class="name">{{ item.name }}</span>

        <input v-if="isEditMode"
            type="text"
            class="name-input"
            ref="nameInput"
            v-model="item.name"
            @keyup.esc="$emit('edit:cancel')"
            @keyup.enter="onEditConfirm()"
            @blur="$emit('edit:cancel')"
            maxlength="80" />

        <due-time-display class="due-time" :date="item.dueDate"></due-time-display>

        <div class="other-information">
            <item-progression :progress="item.subtaskProgress"></item-progression>
            <item-progression :icon="checklistIcon" :progress="item.checklistProgress"></item-progression>
            <item-completion-progress class="item-completion-progress" :progress="item.itemProgress"></item-completion-progress>
        </div>
    </div>
</template>

<script lang="ts">
import { markRaw } from 'vue';
import { Options, Vue, prop } from 'vue-class-component';
import { FormatListCheckbox } from 'mdue';

import { WorkItemDto } from '../../../../core/dtos/work-item-dto';
import { IconMeta } from '../../../../core/models/generic/icon-meta';
import { StyleConfig } from '../../../../core/models/generic/style-config';
import { WorkItemStatus } from '../../../../core/enums/work-item-status.enum';
import { IconUtility } from '../../../../core/utilities/icon-utility/icon-utility';
import DisplayPanel from '../../../../shared/panels/display-panel/display-panel.vue';
import DueTimeDisplay from '../../../../shared/displays/due-time-display/due-time-display.vue';
import ItemProgression from '../../../../shared/displays/item-progression/item-progression.vue';
import ItemCompletionProgress from '../../../../shared/widgets/item-completion-progress/item-completion-progress.vue';

class WorkItemCardProp {
    public item = prop<WorkItemDto>({ default: null });
    public isEditMode = prop<boolean>({ default: false });
}

@Options({
    components: {
        DisplayPanel,
        DueTimeDisplay,
        ItemProgression,
        ItemCompletionProgress
    },
    emits: [
        'edit:cancel',
        'edit:confirm'
    ]
})
export default class WorkItemCard extends Vue.with(WorkItemCardProp) {
    public readonly checklistIcon = markRaw(FormatListCheckbox);
    public isHovering = false;
    public workItemStatus = WorkItemStatus;

    get priorityStyle(): StyleConfig {
        return {
            background: `linear-gradient(
                180deg,
                var(--priority-colors-${this.item.priority}-04) 0%,
                var(--priority-colors-${this.item.priority}-09) 35%,
                var(--priority-colors-${this.item.priority}-09) 65%,
                var(--priority-colors-${this.item.priority}-04) 100%
            )`
        };
    }

    get typeIcon(): IconMeta {
        return IconUtility.getWorkItemIcon(this.item.type);
    }

    public mounted(): void {
        if (!this.isEditMode) {
            return;
        }

        setTimeout(() => {
            if (this.$refs.nameInput) {
                (this.$refs.nameInput as any).focus();
            }
        });
    }

    public onEditConfirm(): void {
        const name = this.item?.name?.trim() ?? '';

        if (name) {
            this.item.name = name;
            this.$emit('edit:confirm');
        }
    }
}
</script>

<style lang="scss" scoped>
.work-item-card-container {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    background-color: var(--primary-colors-8-03);
    font-size: var(--font-sizes-400);

    .hover-layer {
        $gap: 0.5vh;

        pointer-events: none;
        position: absolute;
        left: -$gap;
        width: calc(100% + #{$gap} * 2);
        height: calc(100% + #{$gap} * 2);
        border-left: 1px solid var(--primary-colors-0-00);
        border-right: 1px solid var(--primary-colors-0-00);
        background-color: var(--primary-colors-7-04);
        opacity: 0;
        animation: fade-in 0.2s ease 0.1s forwards;
    }

    .priority {
        max-width: 5px;
        width: 0.225%;
        height: 100%;
    }

    .core-information {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        margin-left: 1%;
        margin-right: 1%;
        width: 7.75%;
        height: 65%;

        .separator {
            width: 1px;
            height: 55%;
            background-color: var(--font-colors-6-00);
        }
    }

    .name, .name-input {
        width: 37.5%;
    }

    .name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .name-input {
        box-sizing: border-box;
        padding: 0.25rem 0;
        border: none;
        outline: none;
        background-color: var(--primary-colors-8-00);
        color: var(--font-colors-0-00);
        font-size: var(--font-sizes-400);
    }

    .due-time {
        margin-left: 2.5%;
        width: 12.5%;
    }

    .other-information {
        display: flex;
        justify-content: space-between;
        margin-left: 1%;
        width: 35%;

        .item-completion-progress {
            width: 60%;
            height: 2vh;
        }
    }
}
</style>
