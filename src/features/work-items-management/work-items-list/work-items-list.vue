<template>
    <div class="work-items-list-container">
        <work-item-card v-if="pendingItem"
            class="pending-item-card"
            :item="pendingItem"
            :isEditMode="true"
            @edit:cancel="$emit('create:cancel')"
            @edit:confirm="$emit('create:confirm')">
        </work-item-card>

        <div class="item-cards">
            <div class="cards-wrapper" ref="cardWrappers">
                <div class="card-wrapper"
                    v-for="(item, index) of workItems"
                    :key="index"
                    @mouseenter="activeIndex = index"
                    @mouseleave="activeIndex = -1">

                    <work-item-status-menu class="status-menu"
                        :activeOption="item.status"
                        :showOptions="activeIndex === index"
                        @select="onStatusSelected(item, $event)"
                        @start="$emit('item:start', item)"
                        @stop="$emit('item:stop', $event)">
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
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import store from '../../../store';
import { WorkItemDto } from '../../../core/dtos/work-item-dto';
import { WorkItem } from '../../../core/models/work-item/work-item';
import { WorkItemStatus } from '../../../core/enums/work-item-status.enum';
import ItemThumbnailScrollbar from '../../../shared/widgets/item-thumbnail-scrollbar/item-thumbnail-scrollbar.vue';

import WorkItemStatusMenu from './work-item-status-menu/work-item-status-menu.vue';
import WorkItemCard from './work-item-card/work-item-card.vue';

class WorkItemsListProp {
    public pendingItem = prop<WorkItemDto>({ default: null });
    public editedItem = prop<WorkItem>({ default: null });
}

@Options({
    components: {
        ItemThumbnailScrollbar,
        WorkItemStatusMenu,
        WorkItemCard
    },
    emits: [
        'create:cancel',
        'create:confirm',
        'update:meta',
        'item:select',
        'item:start',
        'item:stop'
    ]
})
/* istanbul ignore next */
export default class WorkItemsList extends Vue.with(WorkItemsListProp) {
    public activeIndex = -1;

    get workItems(): WorkItemDto[] {
        return store.workItem.getters(this.$store, store.workItem.keys.getters.WorkItems);
    }

    public onStatusSelected(item: WorkItemDto, status: WorkItemStatus): void {
        this.$emit('update:meta', { ...item, status } as WorkItemDto);
    }
}
</script>

<style lang="scss" scoped>
.work-items-list-container {
    $card-gap: 1.25vh;

    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;

    .pending-item-card, .card-wrapper {
        width: 92.5%;
        height: 5vh;
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
            right: 1vh;
        }
    }
}
</style>
