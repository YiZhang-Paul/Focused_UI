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
            <work-item-editor-header class="editor-header"
                :meta="editedWorkItemMeta"
                :item="editedItem"
                @item:update="$emit('item:update', editedItem)">
            </work-item-editor-header>

            <work-item-editor class="item-editor"
                :meta="editedWorkItemMeta"
                :item="editedItem"
                @item:close="$emit('item:close')"
                @item:update="$emit('item:update', editedItem)"
                @item:delete="$emit('item:delete', editedItem)">
            </work-item-editor>
        </div>

        <div v-if="!editedItem" class="item-cards">
            <div class="cards-wrapper" ref="cardWrappers">
                <div class="card-wrapper"
                    v-for="(item, index) of workItems"
                    :key="index"
                    @mouseenter="activeIndex = index"
                    @mouseleave="activeIndex = -1">

                    <work-item-status-menu class="status-menu"
                        :activeOption="item.status"
                        :showOptions="activeIndex === index"
                        @select="onStatusSelected(item, $event)">
                    </work-item-status-menu>

                    <work-item-card class="item-card"
                        :item="item"
                        @click="$emit('item:select', item)">
                    </work-item-card>
                </div>
            </div>

            <item-thumbnail-scrollbar v-if="$refs.cardWrappers"
                class="items-thumbnail"
                :items="workItems"
                :scrollContainer="$refs.cardWrappers">
            </item-thumbnail-scrollbar>
        </div>
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
import ItemThumbnailScrollbar from '../../../shared/widgets/item-thumbnail-scrollbar.vue';

import WorkItemStatusMenu from './work-item-status-menu/work-item-status-menu.vue';
import WorkItemCard from './work-item-card/work-item-card.vue';
import WorkItemEditorHeader from './work-item-editor-header/work-item-editor-header.vue';
import WorkItemEditor from './work-item-editor/work-item-editor.vue';

class WorkItemsListProp {
    public pendingItem = prop<WorkItemDto>({ default: null });
    public editedItem = prop<WorkItem>({ default: null });
}

@Options({
    components: {
        DisplayPanel,
        ItemThumbnailScrollbar,
        WorkItemStatusMenu,
        WorkItemCard,
        WorkItemEditorHeader,
        WorkItemEditor
    },
    emits: [
        'create:cancel',
        'create:confirm',
        'update:meta',
        'item:close',
        'item:update',
        'item:delete',
        'item:select'
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
    $content-width: 92.5%;
    $card-height: 5vh;
    $card-gap: 1.25vh;

    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2.5vh 3.5vh;
    background-color: var(--primary-colors-8-01);

    .pending-item-card, .card-wrapper, .editor-wrapper {
        width: $content-width;
    }

    .pending-item-card, .card-wrapper {
        height: $card-height;
    }

    .editor-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        height: 100%;

        .editor-header {
            width: 100%;
            height: $card-height;
        }

        .item-editor {
            width: 99%;
            height: calc(100% - #{$card-height} - 10px);
        }
    }

    .item-cards {
        position: relative;
        width: 100%;
        height: 100%;

        .cards-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            height: 100%;
            overflow-y: auto;

            &::-webkit-scrollbar {
                width: 0;
                background: transparent;
            }

            .card-wrapper {
                position: relative;
                margin-top: $card-gap;

                .item-card {
                    cursor: pointer;
                    width: 100%;
                    height: 100%;
                }

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

        .items-thumbnail {
            position: absolute;
            top: 0;
            right: 0;
        }
    }
}
</style>
