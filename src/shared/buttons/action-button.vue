<template>
    <div class="action-button-container" :class="buttonClasses">
        <span>{{ text }}</span>
        <div class="back-drop-layer"></div>
    </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';

import { ClassConfig } from '../../core/models/generic/class-config';
import { ActionButtonType } from '../../core/enums/action-button-type.enum';

class ActionButtonProp {
    public text = prop<string>({ default: '' });
    public type = prop<ActionButtonType>({ default: ActionButtonType.Regular });
}

export default class ActionButton extends Vue.with(ActionButtonProp) {

    get buttonClasses(): ClassConfig {
        return {
            'confirm-button': this.type === ActionButtonType.Confirm,
            'warning-button': this.type === ActionButtonType.Warning
        };
    }
}
</script>

<style lang="scss" scoped>
.action-button-container {
    position: relative;
    cursor: pointer;
    display: flex;
    align-self: center;
    justify-content: center;
    padding: 1.25vh 2.5vh;

    &:hover .back-drop-layer {
        opacity: 1;
    }

    span {
        text-transform: uppercase;
        font-size: var(--font-sizes-500);
        color: var(--primary-colors-0-00);
    }

    .back-drop-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        filter: blur(12px);
        transition: opacity 0.4s;
        background: linear-gradient(
            90deg,
            transparent -9.95%,
            var(--primary-colors-0-04) 50.96%,
            transparent 113.89%
        );
    }

    &.confirm-button {

        span {
            color: var(--context-colors-confirm-00);
        }

        .back-drop-layer {
            background: linear-gradient(
                90deg,
                transparent -9.95%,
                var(--context-colors-confirm-04) 50.96%,
                transparent 113.89%
            );
        }
    }

    &.warning-button {

        span {
            color: var(--context-colors-warning-00);
        }

        .back-drop-layer {
            background: linear-gradient(
                90deg,
                transparent -9.95%,
                var(--context-colors-warning-04) 50.96%,
                transparent 113.89%
            );
        }
    }
}
</style>
