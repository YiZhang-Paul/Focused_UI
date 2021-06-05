<template>
    <div class="work-items-list-container">
        <work-item-card class="work-item-card"
            v-for="(item, index) of workItems"
            :key="index"
            :item="item">
        </work-item-card>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../../store';
import { workItemKey } from '../../../store/work-item/work-item.state';
import { WorkItemDto } from '../../../core/dtos/work-item-dto';

import WorkItemCard from './work-item-card/work-item-card.vue';

@Options({
    components: {
        WorkItemCard
    }
})
export default class WorkItemsList extends Vue {

    get workItems(): WorkItemDto[] {
        return store.getters[`${workItemKey}/workItems`];
    }
}
</script>

<style lang="scss" scoped>
.work-items-list-container {
    display: flex;
    flex-direction: column;

    .work-item-card {
        width: 100%;
        height: 5vh;

        &:not(:last-child) {
            margin-bottom: 1.25vh;
        }
    }
}
</style>
