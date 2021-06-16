<template>
    <div class="item-thumbnail-scrollbar-container">
        <div class="block" v-for="item of items" :key="item.id" :style="getBlockStyle(item)">
            <div v-if="item.status === highlightedStatus"></div>
        </div>

        <div v-if="scrollContainer" class="scroll-thumb" :style="thumbStyle"></div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import { WorkItemDto } from '../../core/dtos/work-item-dto';
import { StyleConfig } from '../../core/models/generic/style-config';
import { WorkItemStatus } from '../../core/enums/work-item-status.enum';

class ItemThumbnailScrollbarProp {
    public items = prop<WorkItemDto[]>({ default: [] });
    public scrollContainer = prop<HTMLElement>({ default: null });
}

@Options({
    watch: {
        scrollContainer(): void {
            this.setScroll();
        }
    }
})
export default class ItemThumbnailScrollbar extends Vue.with(ItemThumbnailScrollbarProp) {
    public readonly highlightedStatus = WorkItemStatus.Highlighted;
    public scrollTop = 0;
    public scrollHeight = 0;
    public clientHeight = 0;

    get thumbStyle(): StyleConfig {
        return {
            top: `${this.scrollTop}px`,
            height: `${this.clientHeight * 2 - this.scrollHeight}px`
        };
    }

    public created(): void {
        this.setScroll();
        this.scrollContainer.addEventListener('scroll', this.setScroll);
    }

    public beforeUnmount(): void {
        this.scrollContainer.removeEventListener('scroll', this.setScroll);
    }

    public getBlockStyle(item: WorkItemDto): StyleConfig {
        const color = `var(--priority-colors-${item.priority}-08)`;

        return {
            height: `${100 / this.items.length}%`,
            'background-color': color,
            'box-shadow': `0 0 4px ${color}`
        };
    }

    private setScroll(): void {
        const { scrollTop, scrollHeight, clientHeight } = this.scrollContainer;
        this.scrollTop = scrollTop;
        this.scrollHeight = scrollHeight;
        this.clientHeight = clientHeight;
    }
}
</script>

<style lang="scss" scoped>
.item-thumbnail-scrollbar-container {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 14px;
    height: 100%;

    .block {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;

        div {
            width: 80%;
            height: 3px;
            min-height: 1px;
            background-color: var(--primary-colors-10-00);
            box-shadow: 0 0 4px var(--primary-colors-10-00);
        }
    }

    .scroll-thumb {
        $gap: 0.5vh;

        position: absolute;
        left: -$gap;
        width: calc(100% + #{$gap} * 2);
        border-top: 1px solid var(--primary-colors-0-00);
        border-bottom: 1px solid var(--primary-colors-0-00);
        background-color: var(--primary-colors-7-04);
    }
}
</style>
