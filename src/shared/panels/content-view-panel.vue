<template>
    <div class="content-view-panel-container">
        <view-name-panel :name="'work items'"></view-name-panel>
        <content-view-separator class="content-view-separator"></content-view-separator>

        <div class="actions">
            <slot name="actions"></slot>
        </div>

        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import ContentViewSeparator from '../separators/content-view-separator.vue';

import ViewNamePanel from './view-name-panel.vue';

@Options({
    components: {
        ViewNamePanel,
        ContentViewSeparator
    }
})
export default class ContentViewPanel extends Vue {}
</script>

<style lang="scss" scoped>
.content-view-panel-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    .content-view-separator {
        width: 100%;
    }

    .actions {
        position: absolute;
        top: 4%;
        width: 55vw;
        height: 7.5vh;
    }

    .content {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 85%;
    }
}
</style>
