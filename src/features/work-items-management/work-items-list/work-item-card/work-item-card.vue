<template>
    <div v-if="item" class="work-item-card-container">
        <div class="priority" :style="priorityStyle"></div>

        <display-panel class="core-information">
            <component :is="typeIcon.content" :style="{ color: typeIcon.color }"></component>
            <div class="separator"></div>
            <span>{{ item.estimation }}</span>
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

        <div class="other-information">
            <item-progression :progress="item.subtaskProgress"></item-progression>
            <item-progression :icon="checklistIcon" :progress="item.checklistProgress"></item-progression>
        </div>
    </div>
</template>

<script lang="ts">
import { markRaw } from 'vue';
import { Options, Vue, prop } from 'vue-class-component';
import { FormatListCheckbox } from 'mdue';

import { IconMeta } from '../../../../core/models/generic/icon-meta';
import { WorkItemDto } from '../../../../core/dtos/work-item-dto';
import { IconUtility } from '../../../../core/utilities/icon-utility/icon-utility';
import DisplayPanel from '../../../../shared/panels/display-panel.vue';
import ItemProgression from '../../../../shared/widgets/item-progression.vue';

class WorkItemCardProp {
    public item = prop<WorkItemDto>({ default: null });
    public isEditMode = prop<boolean>({ default: false });
}

@Options({
    components: {
        DisplayPanel,
        ItemProgression
    },
    emits: [
        'edit:cancel',
        'edit:confirm'
    ]
})
export default class WorkItemCard extends Vue.with(WorkItemCardProp) {

    get priorityStyle(): { [key: string]: string } {
        return {
            background: `linear-gradient(
                180deg,
                var(--priority-colors-${this.item.priority}04) 0%,
                var(--priority-colors-${this.item.priority}09) 35%,
                var(--priority-colors-${this.item.priority}09) 65%,
                var(--priority-colors-${this.item.priority}04) 100%
            )`
        };
    }

    get typeIcon(): IconMeta {
        return IconUtility.getWorkItemIcon(this.item.type);
    }

    get checklistIcon(): any {
        return markRaw(FormatListCheckbox);
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
    background-color: var(--primary-colors-803);
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
        width: 4.25%;
        height: 65%;

        .separator {
            width: 1px;
            height: 55%;
            background-color: var(--font-colors-600);
        }
    }

    .name, .name-input {
        width: 45%;
    }

    .name-input {
        box-sizing: border-box;
        padding: 0.25rem 0;
        border: none;
        outline: none;
        background-color: var(--primary-colors-800);
        color: var(--font-colors-000);
        font-size: var(--font-sizes-400);
    }

    .other-information {
        display: flex;
        justify-content: space-between;
        margin-left: 1%;
        width: 10%;
    }
}
</style>
