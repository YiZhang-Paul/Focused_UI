<template>
    <display-panel v-if="item"
        class="work-item-editor-container"
        :lineLength="'1vh'"
        :corners="[false, false, true, true]">
    </display-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import { WorkItem } from '../../../../core/models/work-item/work-item';
import DisplayPanel from '../../../../shared/panels/display-panel.vue';

class WorkItemEditorProp {
    public item = prop<WorkItem>({ default: null });
}

@Options({
    components: {
        DisplayPanel
    }
})
export default class WorkItemEditor extends Vue.with(WorkItemEditorProp) {}
</script>

<style lang="scss" scoped>
.work-item-editor-container {
    background: linear-gradient(
        269.98deg,
        var(--primary-colors-7-02) 0.02%,
        var(--primary-colors-7-01) 99.98%
    );
}
</style>
