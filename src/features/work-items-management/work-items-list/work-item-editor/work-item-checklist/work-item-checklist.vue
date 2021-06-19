<template>
    <div class="work-item-checklist-container">
        <div class="checklist-entry" v-for="(entry, index) of entries" :key="index">
            <text-input class="name"
                v-model="entry.description"
                @update:modelValue="$emit('update', entries)">
            </text-input>

            <delete class="delete-button action-button" @click="deleteEntry(index)" />
        </div>

        <div class="add-checklist">
            <plus-box class="add-button action-button"
                :class="{ disabled: !pendingEntry }"
                @click="addEntry()" />

            <text-input class="name"
                v-model="pendingEntry"
                :placeholder="'add checklist entry...'"
                :isEmptyAllowed="true"
                :isInstantUpdate="true"
                @keyup.enter="addEntry()">
            </text-input>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { Delete, PlusBox } from 'mdue';

import { ChecklistEntry } from '../../../../../core/models/work-item/checklist-entry';
import { GenericUtility } from '../../../../../core/utilities/generic-utility/generic-utility';
import TextInput from '../../../../../shared/inputs/text-input.vue';

class WorkItemChecklistProp {
    public entries = prop<ChecklistEntry[]>({ default: [] });
}

@Options({
    components: {
        Delete,
        PlusBox,
        TextInput
    },
    emits: ['update']
})
export default class WorkItemChecklist extends Vue.with(WorkItemChecklistProp) {
    public pendingEntry = '';

    public deleteEntry(index: number): void {
        this.$emit('update', GenericUtility.removeAt(this.entries, index));
    }

    public addEntry(): void {
        if (this.pendingEntry) {
            const entry = { description: this.pendingEntry } as ChecklistEntry;
            this.$emit('update', [...this.entries, entry]);
            this.pendingEntry = '';
        }
    }
}
</script>

<style lang="scss" scoped>
.work-item-checklist-container {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 2.5vh 0;

    .checklist-entry, .add-checklist {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 75%;
        height: 4vh;
        border-radius: 3px;
        background-color: var(--primary-colors-7-02);

        .name {
            flex: 1;
        }

        .action-button {
            color: var(--font-colors-0-07);
            font-size: var(--font-sizes-500);
            transition: color 0.3s;

            &.disabled {
                color: var(--font-colors-5-00);
            }

            &:hover:not(.disabled) {
                cursor: pointer;
            }
        }
    }

    .checklist-entry {
        padding-left: 0.75vh;
        padding-right: 1vh;
        margin-bottom: 0.75vh;

        .delete-button {
            margin-left: 1vh;

            &:hover {
                color: var(--context-colors-warning-00);
            }
        }
    }

    .add-checklist {
        padding-left: 1vh;
        padding-right: 0.75vh;

        .add-button {
            margin-right: 1vh;

            &:hover:not(.disabled) {
                color: var(--font-colors-0-00);
            }
        }
    }
}
</style>
