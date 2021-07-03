<template>
    <div class="dialog-panel-container">
        <div class="content-panel">
            <div class="content">
                <slot></slot>
                <panel-border-separator class="separator-right"></panel-border-separator>
                <panel-border-separator class="separator-left"></panel-border-separator>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import PanelBorderSeparator from '../../separators/panel-border-separator/panel-border-separator.vue';

@Options({
    components: {
        PanelBorderSeparator
    }
})
export default class DialogPanel extends Vue {}
</script>

<style lang="scss" scoped>
.dialog-panel-container {
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: rgba(255, 255, 255, 0.01);
    backdrop-filter: blur(20px);
    opacity: 0;
    animation: fade-in 0.4s ease forwards;

    .content-panel {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40vw;
        height: 55vh;

        .content {
            position: relative;
            width: 0;
            height: 100%;
            background-color: var(--primary-colors-8-08);
            backdrop-filter: blur(5px);
            animation: expand-width 0.4s ease 0.6s forwards;

            .separator-left, .separator-right {
                position: absolute;
                height: 106%;
            }

            .separator-left {
                bottom: -30%;
                left: -27px;
                transform: rotateX(180deg) rotateY(180deg);
                opacity: 0;
                animation: fade-in 0.4s ease forwards,
                           move-separator-left 0.4s ease 0.2s forwards;
            }

            .separator-right {
                top: -30%;
                right: -27px;
                opacity: 0;
                animation: fade-in 0.4s ease forwards,
                           move-separator-right 0.4s ease 0.2s forwards;
            }

            @keyframes move-separator-left {
                from { bottom: -30% }
                to { bottom: -4.5% }
            }

            @keyframes move-separator-right {
                from { top: -30% }
                to { top: -4.5% }
            }
        }
    }
}
</style>
