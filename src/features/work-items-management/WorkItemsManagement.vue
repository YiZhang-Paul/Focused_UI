<template>
    <div></div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

import store from '../../store';
import { workItemKey } from '../../store/work-item/work-item.state';

export default class WorkItemsManagement extends Vue {

    public created(): void {
        store.dispatch(`${workItemKey}/loadWorkItems`);
    }
}
</script>
