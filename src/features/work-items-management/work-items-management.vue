<template>
    <div class="work-items-management-container">
        <work-items-list class="work-items-list"
            :pendingItem="pendingItem"
            @create:cancel="cancelCreate()"
            @create:confirm="confirmCreate()">
        </work-items-list>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../store';
import { workItemKey } from '../../store/work-item/work-item.state';
import { WorkItemDto } from '../../core/dtos/work-item-dto';

import WorkItemsList from './work-items-list/work-items-list.vue';

@Options({
    components: {
        WorkItemsList
    }
})
export default class WorkItemsManagement extends Vue {

    get pendingItem(): WorkItemDto | null {
        return store.getters[`${workItemKey}/pendingWorkItem`];
    }

    public created(): void {
        store.dispatch(`${workItemKey}/loadWorkItems`);
    }

    public cancelCreate(): void {
        store.commit(`${workItemKey}/setPendingWorkItem`, null);
    }

    public confirmCreate(): void {
        store.dispatch(`${workItemKey}/createWorkItem`);
    }
}
</script>

<style lang="scss" scoped>
.work-items-management-container {
    display: flex;
    align-items: center;
    justify-content: center;

    .work-items-list {
        width: 65%;
        height: 95%;
    }
}
</style>
