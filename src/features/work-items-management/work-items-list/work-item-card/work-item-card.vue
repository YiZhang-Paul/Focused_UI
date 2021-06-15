<template>
    <div v-if="item" class="work-item-card-container">
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

        <span class="due-time" :class="{ 'due-time-alert': dueTime <= 1 }">{{ dueTimeText }}</span>

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
import DisplayPanel from '../../../../shared/panels/display-panel.vue';
import ItemProgression from '../../../../shared/displays/item-progression.vue';
import ItemCompletionProgress from '../../../../shared/widgets/item-completion-progress.vue';

class WorkItemCardProp {
    public item = prop<WorkItemDto>({ default: null });
    public isEditMode = prop<boolean>({ default: false });
}

@Options({
    components: {
        DisplayPanel,
        ItemProgression,
        ItemCompletionProgress
    },
    emits: [
        'edit:cancel',
        'edit:confirm'
    ]
})
export default class WorkItemCard extends Vue.with(WorkItemCardProp) {
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

    get checklistIcon(): any {
        return markRaw(FormatListCheckbox);
    }

    get dueTimeText(): string {
        if (!this.item.dueDate || this.dueTime > 24) {
            return '';
        }

        if (this.dueTime <= 0) {
            return 'past due';
        }

        if (this.dueTime <= 1) {
            const minutes = this.dueTime * 60;

            return `due in ${minutes.toFixed(0)} minute${minutes > 1 ? 's' : ''}`;
        }

        return `due in ${this.dueTime.toFixed(0)} hour${this.dueTime > 1 ? 's' : ''}`;
    }

    get dueTime(): number {
        const oneHour = 60 * 60 * 1000;
        const date = this.item.dueDate ? new Date(this.item.dueDate) : null;

        return date ? (date.getTime() - Date.now()) / oneHour : 0;
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
    box-sizing: border-box;
    display: flex;
    align-items: center;
    background-color: var(--primary-colors-8-03);
    font-size: var(--font-sizes-400);

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

        &.due-time-alert {
            color: var(--context-colors-warning-00);
        }
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
