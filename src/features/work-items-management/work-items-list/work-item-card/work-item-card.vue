<template>
    <div v-if="item" class="work-item-card-container">
        <div class="priority" :style="priorityStyle"></div>

        <display-panel class="core-information">
            <component :is="typeIcon.content" :style="{ color: typeIcon.color }"></component>
            <div class="separator"></div>
            <span>{{ item.estimation }}</span>
        </display-panel>

        <span class="name">{{ item.name }}</span>

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
}

@Options({
    components: {
        DisplayPanel,
        ItemProgression
    }
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

    .name {
        width: 45%;
    }

    .other-information {
        display: flex;
        justify-content: space-between;
        width: 10%;
    }
}
</style>
