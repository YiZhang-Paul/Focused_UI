<template>
    <div class="work-items-management-container">
        <work-items-list class="work-items-list"></work-items-list>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../store';
import { workItemKey } from '../../store/work-item/work-item.state';

import WorkItemsList from './work-items-list/work-items-list.vue';

@Options({
    components: {
        WorkItemsList
    }
})
export default class WorkItemsManagement extends Vue {

    public created(): void {
        store.dispatch(`${workItemKey}/loadWorkItems`);
    }
}
</script>

<style lang="scss" scoped>
.work-items-management-container {
    display: flex;
    align-items: center;
    justify-content: center;

    .work-items-list {
        width: 80%;
        height: 80%;
        background-color: rgb(59, 68, 91, 0.1);
    }
}
</style>
