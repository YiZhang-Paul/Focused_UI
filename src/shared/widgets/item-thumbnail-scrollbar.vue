<template>
    <div class="item-thumbnail-scrollbar-container">
        <div class="block"
            v-for="item of items"
            :key="item.id"
            :style="{
                height: `${100 / items.length}%`,
                'background-color': `var(--priority-colors-${item.priority}-00)`
            }">
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';

import { WorkItemDto } from '../../core/dtos/work-item-dto';

class ItemThumbnailScrollbarProp {
    public items = prop<WorkItemDto[]>({ default: [] });
}

export default class ItemThumbnailScrollbar extends Vue.with(ItemThumbnailScrollbarProp) {}
</script>

<style lang="scss" scoped>
.item-thumbnail-scrollbar-container {
    display: flex;
    flex-direction: column;
    min-width: 10px;
    height: 100%;
    max-height: 100%;

    .block {
        width: 100%;
    }
}
</style>
