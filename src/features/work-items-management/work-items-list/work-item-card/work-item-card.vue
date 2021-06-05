<template>
    <div v-if="item" class="work-item-card-container">
        <span>{{ item.priority }}</span>
        <span>{{ item.type }}</span>
        <span>{{ item.estimation }}</span>
        <span>{{ item.name }}</span>
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
    align-items: center;
    padding: 2.75% 2.5%;
    background-color: rgb(59, 68, 91, 0.3);
    color: white;
}
</style>
