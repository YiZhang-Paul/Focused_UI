<template>
    <work-items-management class="work-items-management"></work-items-management>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import WorkItemsManagement from './features/work-items-management/WorkItemsManagement.vue';

@Options({
    components: {
        WorkItemsManagement
    }
})
export default class App extends Vue {}
</script>

<style lang="scss">
html, body, #app {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    user-select: none;
    background-color: transparent;
}

#app {
    display: flex;
    flex-direction: column;
}

.work-items-management {
    width: 100%;
    height: 75%;
}
</style>
