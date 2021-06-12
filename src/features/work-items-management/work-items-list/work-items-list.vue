<template>
    <display-panel class="work-items-list-container" :lineLength="'1.25vh'">
        <work-item-card v-if="pendingItem"
            class="pending-item-card"
            :item="pendingItem"
            :isEditMode="true"
            @edit:cancel="$emit('create:cancel')"
            @edit:confirm="$emit('create:confirm')">
        </work-item-card>

        <div class="editor-wrapper" v-if="editedItem && editedWorkItemMeta">
            <work-item-card class="item-card" :item="editedWorkItemMeta"></work-item-card>
            <work-item-editor class="item-editor" :item="editedItem"></work-item-editor>
        </div>

        <template v-if="!editedItem">
            <div class="card-wrapper"
                v-for="(item, index) of workItems"
                :key="index"
                @click="$emit('select', item)"
                @mouseenter="activeIndex = index"
                @mouseleave="activeIndex = -1">

                <work-item-status-menu class="status-menu"
                    :activeOption="item.status"
                    :showOptions="activeIndex === index"
                    @select="onStatusSelected(item, $event)">
                </work-item-status-menu>

                <work-item-card class="item-card" :item="item"></work-item-card>
            </div>
        </template>
    </display-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import store from '../../../store';
import { workItemKey } from '../../../store/work-item/work-item.state';
import { WorkItemDto } from '../../../core/dtos/work-item-dto';
import { WorkItem } from '../../../core/models/work-item/work-item';
import { WorkItemStatus } from '../../../core/enums/work-item-status.enum';
import DisplayPanel from '../../../shared/panels/display-panel.vue';

import WorkItemStatusMenu from './work-item-status-menu/work-item-status-menu.vue';
import WorkItemCard from './work-item-card/work-item-card.vue';
import WorkItemEditor from './work-item-editor/work-item-editor.vue';

class WorkItemsListProp {
    public pendingItem = prop<WorkItemDto>({ default: null });
    public editedItem = prop<WorkItem>({ default: null });
}

@Options({
    components: {
        DisplayPanel,
        WorkItemStatusMenu,
        WorkItemCard,
        WorkItemEditor
    },
    emits: [
        'create:cancel',
        'create:confirm',
        'update:meta',
        'select'
    ]
})
export default class WorkItemsList extends Vue.with(WorkItemsListProp) {
    public activeIndex = -1;

    get editedWorkItemMeta(): WorkItemDto | null {
        return store.getters[`${workItemKey}/editedWorkItemMeta`];
    }

    get workItems(): WorkItemDto[] {
        return store.getters[`${workItemKey}/workItems`];
    }

    public onStatusSelected(item: WorkItemDto, status: WorkItemStatus): void {
        this.$emit('update:meta', { ...item, status } as WorkItemDto);
    }
}
</script>

<style lang="scss" scoped>
.work-items-list-container {
    $content-width: 97.5%;
    $card-height: 5vh;

    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2.5vh 5vh;
    background-color: var(--primary-colors-8-01);

    .pending-item-card, .card-wrapper {
        width: $content-width;
        height: $card-height;

        &:not(:last-child) {
            margin-bottom: 1.25vh;
        }

        .item-card {
            cursor: pointer;
            width: 100%;
            height: 100%;
        }
    }

    .editor-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        width: $content-width;
        height: 100%;

        .item-card {
            width: 100%;
            height: $card-height;
        }

        .item-editor {
            width: 99%;
            height: calc(100% - #{$card-height} - 10px);
        }
    }

    .card-wrapper {
        position: relative;

        .status-menu {
            $width: 4vh;
            $height: 130%;

            position: absolute;
            top: calc(50% - #{$height} / 2);
            left: -$width;
            width: $width;
            height: $height;
        }
    }
}
</style>
