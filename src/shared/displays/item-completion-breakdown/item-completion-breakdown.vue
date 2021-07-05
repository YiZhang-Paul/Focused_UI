<template>
    <div class="item-completion-breakdown-container">
        <template v-for="group of groups" :key="group.icon">
            <template v-if="group.items.length">
                <div class="separator">
                    <div></div>
                    <component :is="group.icon" class="icon"></component>
                    <div></div>
                </div>

                <div class="item-summary" v-for="item of group.items" :key="item.id">
                    <component class="icon"
                        :is="getTypeIcon(item.type).content"
                        :style="{ color: getTypeIcon(item.type).color }">
                    </component>

                    <span class="name">{{ item.name }}</span>
                    <div class="filler"></div>

                    <div class="progressions">
                        <item-progression class="subtask-progression" :progress="item.subtaskProgress"></item-progression>
                        <item-progression :icon="checklistIcon" :progress="item.checklistProgress"></item-progression>
                    </div>
                </div>
            </template>
        </template>
    </div>
</template>

<script lang="ts">
import { markRaw } from 'vue';
import { Options, Vue, prop } from 'vue-class-component';
import { CheckboxMarkedOutline, FormatListCheckbox, ProgressClock } from 'mdue';

import { WorkItemDto } from '../../../core/dtos/work-item-dto';
import { IconMeta } from '../../../core/models/generic/icon-meta';
import { WorkItemType } from '../../../core/enums/work-item-type.enum';
import { IconUtility } from '../../../core/utilities/icon-utility/icon-utility';
import ItemProgression from '../../displays/item-progression/item-progression.vue';

class ItemCompletionBreakdownProp {
    public items = prop<WorkItemDto[]>({ default: [] });
}

@Options({
    components: {
        CheckboxMarkedOutline,
        ProgressClock,
        ItemProgression
    }
})
export default class ItemCompletionBreakdown extends Vue.with(ItemCompletionBreakdownProp) {
    public readonly checklistIcon = markRaw(FormatListCheckbox);

    get groups(): { icon: any; items: WorkItemDto[] }[] {
        const completed = this.items.filter(_ => _.itemProgress.isCompleted);
        const incomplete = this.items.filter(_ => !_.itemProgress.isCompleted);

        return [
            { icon: markRaw(CheckboxMarkedOutline), items: completed },
            { icon: markRaw(ProgressClock), items: incomplete }
        ];
    }

    public getTypeIcon(type: WorkItemType): IconMeta {
        return IconUtility.getWorkItemIcon(type);
    }
}
</script>

<style lang="scss" scoped>
.item-completion-breakdown-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .separator {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 0.25vh;

        & > div {
            width: 43.5%;
            height: 1px;

            &:first-of-type {
                background: linear-gradient(to right, transparent, var(--primary-colors-5-00));
            }

            &:last-of-type {
                background: linear-gradient(to left, transparent, var(--primary-colors-5-00));
            }
        }

        .icon {
            color: var(--font-colors-2-00);
            font-size: var(--font-sizes-500);
        }
    }

    .item-summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 0.75vh;

        .icon {
            margin-right: 0.5vh;
            font-size: var(--font-sizes-500);
        }

        .name {
            max-width: 70%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .filler {
            flex: 1;
        }

        .progressions {
            display: flex;
            align-items: center;

            .subtask-progression {
                margin-right: 1vh;
            }
        }
    }
}
</style>
