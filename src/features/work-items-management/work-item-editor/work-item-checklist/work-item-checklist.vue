<template>
    <div class="work-item-checklist-container">
        <span class="title">Checklist</span>

        <div class="placeholder" v-if="!entries.length">
            <span>nothing created yet.</span>
        </div>

        <overlay-scroll-panel class="entries-wrapper" v-if="entries.length">
            <div class="entries">
                <div class="entry" v-for="(entry, index) of entries" :key="index">
                    <check class="check-button action-button"
                        v-if="entry.isCompleted"
                        @click="toggleCompletion(index)" />

                    <radiobox-blank class="uncheck-button action-button"
                        v-if="!entry.isCompleted"
                        @click="toggleCompletion(index)" />

                    <text-input class="name"
                        v-model="entry.description"
                        @update:modelValue="$emit('update', entries)">
                    </text-input>

                    <delete class="delete-button action-button" @click="deleteEntry(index)" />
                </div>
            </div>
        </overlay-scroll-panel>

        <display-panel class="add-checklist">
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
        </display-panel>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { Check, Delete, PlusBox, RadioboxBlank } from 'mdue';

import { ChecklistEntry } from '../../../../core/models/work-item/checklist-entry';
import { GenericUtility } from '../../../../core/utilities/generic-utility/generic-utility';
import DisplayPanel from '../../../../shared/panels/display-panel/display-panel.vue';
import OverlayScrollPanel from '../../../../shared/panels/overlay-scroll-panel/overlay-scroll-panel.vue';
import TextInput from '../../../../shared/inputs/text-input.vue';

class WorkItemChecklistProp {
    public entries = prop<ChecklistEntry[]>({ default: [] });
}

@Options({
    components: {
        Check,
        Delete,
        PlusBox,
        RadioboxBlank,
        DisplayPanel,
        OverlayScrollPanel,
        TextInput
    },
    emits: ['update']
})
export default class WorkItemChecklist extends Vue.with(WorkItemChecklistProp) {
    public pendingEntry = '';

    public toggleCompletion(index: number): void {
        const entry = this.entries[index];
        const toggled = { ...entry, isCompleted: !entry.isCompleted };
        this.$emit('update', GenericUtility.replaceAt(this.entries, toggled, index));
    }

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
    padding-top: 2.5vh;
    padding-bottom: 2.5vh;

    .title {
        margin-bottom: 2.5vh;
        font-size: var(--font-sizes-500);
    }

    .placeholder, .entries-wrapper {
        margin-bottom: 0.75vh;
        height: 100%;
    }

    .entry, .add-checklist {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-around;
        height: 4vh;
        min-height: 4vh;
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

    .placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 75%;
        border-radius: 3px;
        background-color: var(--primary-colors-7-02);
        color: var(--font-colors-5-00);
    }

    .entries-wrapper {
        width: 80%;

        .entries {
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;

            .entry {
                padding-left: 1vh;
                padding-right: 1vh;
                width: 93.75%;

                &:hover .delete-button {
                    opacity: 1;
                }

                &:not(:last-of-type) {
                    margin-bottom: 0.75vh;
                }

                .check-button, .uncheck-button {
                    margin-right: 0.75vh;
                    opacity: 0;
                    animation: fade-in 0.3s ease forwards;
                }

                .check-button {
                    color: var(--context-colors-confirm-00);
                }

                .uncheck-button {
                    color: var(--context-colors-alert-00);
                }

                .delete-button {
                    margin-left: 0.75vh;
                    opacity: 0;
                    transition: opacity 0.3s;

                    &:hover {
                        color: var(--context-colors-warning-00);
                    }
                }
            }
        }
    }

    .add-checklist {
        padding-left: 1vh;
        padding-right: 0.75vh;
        width: 75%;

        .add-button {
            margin-right: 0.75vh;

            &:hover:not(.disabled) {
                color: var(--font-colors-0-00);
            }
        }
    }
}
</style>
