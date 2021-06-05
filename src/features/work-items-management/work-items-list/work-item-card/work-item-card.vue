<template>
    <div v-if="item" class="work-item-card-container">
        <div class="priority"></div>

        <div class="content">
            <span>{{ item.type }}</span>
            <span>{{ item.estimation }}</span>
            <span>{{ item.name }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';

import { WorkItemDto } from '../../../../core/dtos/work-item-dto';

class WorkItemCardProp {
    public item = prop<WorkItemDto>({ default: null });
}

export default class WorkItemCard extends Vue.with(WorkItemCardProp) {}
</script>

<style lang="scss" scoped>
.work-item-card-container {
    box-sizing: border-box;
    display: flex;
    background-color: var(--primary-colors-803);
    color: var(--font-colors-000);
    font-size: var(--font-sizes-400);

    .priority {
        max-width: 5px;
        width: 0.225%;
        height: 100%;
        background: linear-gradient(
            180deg,
            var(--priority-colors-304) 0%,
            var(--priority-colors-309) 35%,
            var(--priority-colors-309) 65%,
            var(--priority-colors-304) 100%
        );
    }

    .content {
        margin-left: 1%;
        display: flex;
        align-items: center;
    }
}
</style>
