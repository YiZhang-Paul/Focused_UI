<template>
    <div class="work-item-checklist-container">
        <div class="add-checklist">
            <text-input class="name"
                v-model="pendingEntry"
                :placeholder="'add checklist entry...'"
                :isEmptyAllowed="true"
                :isInstantUpdate="true">
            </text-input>

            <plus-box class="add-button" :class="{ disabled: !pendingEntry }" />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { PlusBox } from 'mdue';

import { ChecklistEntry } from '../../../../../core/models/work-item/checklist-entry';
import TextInput from '../../../../../shared/inputs/text-input.vue';

class WorkItemChecklistProp {
    public entries = prop<ChecklistEntry[]>({ default: [] });
}

@Options({
    components: {
        PlusBox,
        TextInput
    },
    emits: ['update']
})
export default class WorkItemChecklist extends Vue.with(WorkItemChecklistProp) {
    public pendingEntry = '';
}
</script>

<style lang="scss" scoped>
.work-item-checklist-container {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 2.5vh 0;

    .add-checklist {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding-left: 0.75vh;
        padding-right: 1vh;
        width: 75%;
        height: 4vh;
        border-radius: 3px;
        background-color: var(--primary-colors-7-02);

        .name {
            flex: 1;
        }

        .add-button {
            margin-left: 1vh;
            color: var(--font-colors-0-08);
            font-size: var(--font-sizes-500);
            transition: color 0.3s;

            &.disabled {
                color: var(--font-colors-5-00);
            }

            &:hover:not(.disabled) {
                cursor: pointer;
                color: var(--font-colors-0-00);
            }
        }
    }
}
</style>
