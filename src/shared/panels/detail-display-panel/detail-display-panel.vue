<template>
    <div class="detail-display-panel-container">
        <div class="top-guard"></div>
        <div class="content" :class="{ visible: showContent }"><slot></slot></div>
        <div class="bottom-guard"></div>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class DetailDisplayPanel extends Vue {
    public showContent = false;

    public mounted(): void {
        setTimeout(() => this.showContent = true, 600);
    }
}
</script>

<style lang="scss" scoped>
.detail-display-panel-container {
    position: relative;

    .content {
        all: inherit;
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: opacity 0.2s;

        &.visible {
            opacity: 1;
        }
    }

    .top-guard, .bottom-guard {
        position: absolute;
        width: 0;
        height: 2px;
        animation: expand-width 0.3s ease-out 0.2s forwards;
    }

    .top-guard {
        top: 0;
        right: 0;
        background: linear-gradient(
            to right,
            var(--primary-colors-0-00) 0%,
            transparent 100%
        );
    }

    .bottom-guard {
        bottom: 0;
        left: 0;
        background: linear-gradient(
            to left,
            var(--primary-colors-0-00) 0%,
            transparent 100%
        );
    }
}
</style>
