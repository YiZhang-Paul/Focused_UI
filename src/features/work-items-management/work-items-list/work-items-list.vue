<template>
    <display-panel class="work-items-list-container" :lineLength="'1.25vh'">
        <work-item-card v-if="pendingItem"
            class="pending-item-card"
            :item="pendingItem"
            :isEditMode="true"
            @edit:cancel="$emit('create:cancel')"
            @edit:confirm="$emit('create:confirm')">
        </work-item-card>

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

class WorkItemsListProp {
    public pendingItem = prop<WorkItemDto>({ default: null });
    public editedItem = prop<WorkItem>({ default: null });
}

@Options({
    components: {
        DisplayPanel,
        WorkItemStatusMenu,
        WorkItemCard
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
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2.5vh 5vh;
    background-color: var(--primary-colors-8-01);

    .pending-item-card, .card-wrapper {
        width: 97.5%;
        height: 5vh;

        &:not(:last-child) {
            margin-bottom: 1.25vh;
        }

        .item-card {
            width: 100%;
            height: 100%;
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
