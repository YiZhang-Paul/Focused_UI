<template>
    <work-items-management class="work-items-management"></work-items-management>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import WorkItemsManagement from './features/work-items-management/work-items-management.vue';

@Options({
    components: {
        WorkItemsManagement
    }
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import './styles/presets.scss';

html, body, #app {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    user-select: none;
}

#app {
    display: flex;
    flex-direction: column;
    background-color: var(--primary-colors-1000);
    font-family: 'Roboto';
    font-size: 16px;
}

.work-items-management {
    width: 100%;
    height: 75%;
}
</style>
