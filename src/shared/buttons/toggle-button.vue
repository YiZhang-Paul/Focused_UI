<template>
    <div class="toggle-button-container" :class="{ 'active-button': isActive }">
        <svg v-if="type === 'left'" width="36" height="26" viewBox="0 0 36 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M34.6 1H1V25H31.4L34.6 1Z" />
        </svg>

        <svg v-if="type === 'middle'" width="38" height="26" viewBox="0 0 38 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.40002 25L4.60002 1H36.6L33.4 25H1.40002Z" />
        </svg>

        <svg v-if="type === 'right'" width="36" height="26" viewBox="0 0 36 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M35 1H4.59999L1.39999 25H35V1Z" />
        </svg>

        <component class="icon"
            :class="{ 'left-icon': type === 'left', 'right-icon': type === 'right' }"
            :is="option.content"
            :style="{ color: isActive ? option.color : null }">
        </component>
    </div>
</template>

<script lang="ts">
import { IconMeta } from '@/core/models/generic/icon-meta';
import { Vue, prop } from 'vue-class-component';

class ToggleButtonProp {
    public type = prop<string>({ default: 'left' });
    public option = prop<IconMeta>({ default: null });
    public isActive = prop<boolean>({ default: false });
}

export default class ToggleButton extends Vue.with(ToggleButtonProp) {}
</script>

<style lang="scss" scoped>
.toggle-button-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &.active-button path, &:hover path {
        fill: rgb(90, 176, 255);
        fill-opacity: 0.35;
        stroke: rgb(90, 176, 255);
        stroke-opacity: 0.85;
    }

    &:hover .icon {
        color: var(--font-colors-0-00);
    }

    path {
        fill: rgb(59, 68, 91);
        fill-opacity: 0.5;
        stroke: rgb(121, 133, 165);
        stroke-opacity: 0.85;
        transition: all 0.3s;
    }

    .icon {
        position: absolute;
        color: var(--font-colors-5-00);
        font-size: var(--font-sizes-500);
        transition: color 0.3s;

        &.left-icon {
            transform: translateX(-0.075rem);
        }

        &.right-icon {
            transform: translateX(0.075rem);
        }
    }
}
</style>
