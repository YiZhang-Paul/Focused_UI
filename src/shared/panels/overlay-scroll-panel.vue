<template>
    <div :id="id"><slot></slot></div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import OverlayScrollbars from 'overlayscrollbars';
import * as uuid from 'uuid';

export default class OverlayScrollPanel extends Vue {
    public readonly id = `overlay-scroll-panel-container-${uuid.v4()}`;

    public mounted(): void {
        OverlayScrollbars(document.querySelectorAll(`#${this.id}`), {
            scrollbars: {
                autoHide: 'leave',
                autoHideDelay: 125
            }
        });
    }
}
</script>
