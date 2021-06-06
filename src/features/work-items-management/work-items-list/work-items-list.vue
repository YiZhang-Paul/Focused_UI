<template>
    <display-panel class="work-items-list-container" :lineLength="'1.25vh'">
        <work-item-card v-if="pendingItem" class="work-item-card" :item="pendingItem"></work-item-card>

        <work-item-card class="work-item-card"
            v-for="(item, index) of workItems"
            :key="index"
            :item="item">
        </work-item-card>
    </display-panel>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../../store';
import { workItemKey } from '../../../store/work-item/work-item.state';
import { WorkItemDto } from '../../../core/dtos/work-item-dto';
import DisplayPanel from '../../../shared/panels/display-panel.vue';

import WorkItemCard from './work-item-card/work-item-card.vue';

@Options({
    components: {
        DisplayPanel,
        WorkItemCard
    }
})
export default class WorkItemsList extends Vue {

    get pendingItem(): WorkItemDto | null {
        return store.getters[`${workItemKey}/pendingWorkItem`];
    }

    get workItems(): WorkItemDto[] {
        return store.getters[`${workItemKey}/workItems`];
    }
}
</script>

<style lang="scss" scoped>
.work-items-list-container {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 2.5vh 5vh;
    background-color: var(--primary-colors-801);

    .work-item-card {
        width: 100%;
        height: 5vh;

        &:not(:last-child) {
            margin-bottom: 1.25vh;
        }
    }
}
</style>
