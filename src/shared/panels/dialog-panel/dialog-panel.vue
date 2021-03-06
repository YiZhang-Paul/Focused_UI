<template>
    <div class="dialog-panel-container">
        <div class="content-panel" :style="{ width, height }">
            <div class="content">
                <component v-if="showDialog && dialog"
                    class="dialog"
                    :is="dialog"
                    :data="data"
                    @dialog:cancel="$emit('dialog:cancel')"
                    @dialog:confirm="$emit('dialog:confirm', $event)">
                </component>

                <panel-border-separator class="separator-right"></panel-border-separator>
                <panel-border-separator class="separator-left"></panel-border-separator>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import PanelBorderSeparator from '../../separators/panel-border-separator/panel-border-separator.vue';

class DialogPanelProp {
    public dialog = prop<any>({ default: null });
    public data = prop<any>({ default: null });
    public width = prop<string>({ default: '40vw' });
    public height = prop<string>({ default: '55vh' });
}

@Options({
    components: {
        PanelBorderSeparator
    },
    emits: [
        'dialog:cancel',
        'dialog:confirm'
    ]
})
/* istanbul ignore next */
export default class DialogPanel extends Vue.with(DialogPanelProp) {
    public showDialog = false;

    public mounted(): void {
        setTimeout(() => this.showDialog = true, 500);
    }
}
</script>

<style lang="scss" scoped>
.dialog-panel-container {
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
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

        .content {
            position: relative;
            width: 0;
            height: 100%;
            background-color: var(--primary-colors-8-08);
            backdrop-filter: blur(5px);
            animation: expand-width 0.2s ease 0.3s forwards;

            .dialog {
                width: 100%;
                height: 100%;
            }

            .separator-left, .separator-right {
                position: absolute;
                height: 106%;
            }

            .separator-left {
                bottom: -30%;
                left: -25px;
                transform: rotateX(180deg) rotateY(180deg);
                opacity: 0;
                animation: fade-in 0.15s ease forwards,
                           move-separator-left 0.2s ease 0.1s forwards;
            }

            .separator-right {
                top: -30%;
                right: -25px;
                opacity: 0;
                animation: fade-in 0.15s ease forwards,
                           move-separator-right 0.2s ease 0.1s forwards;
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
