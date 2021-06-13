<template>
    <div class="estimation-selector-container" ref="container">
        <div class="value-wrapper" @click="showOptions = !showOptions">
            <span>{{ transform ? transform(modelValue) : modelValue }}</span>
        </div>

        <display-panel class="options" v-if="showOptions">
            <lightsource-panel class="lightsource-panel"></lightsource-panel>

            <span v-for="(option, index) of options" :key="index" @click="onSelect(option)">
                {{ transform ? transform(option) : option }}
            </span>
        </display-panel>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import DisplayPanel from '../panels/display-panel.vue';
import LightsourcePanel from '../panels/lightsource-panel.vue';

class EstimationSelectorProp {
    public modelValue = prop<number>({ default: 0 });
    public options = prop<number[]>({ default: [] });
    public transform = prop<() => string>({ default: null });
}

@Options({
    components: {
        DisplayPanel,
        LightsourcePanel
    },
    emits: ['update:modelValue']
})
export default class EstimationSelector extends Vue.with(EstimationSelectorProp) {
    public showOptions = false;

    public mounted(): void {
        document.addEventListener('click', this.onClickOutside);
    }

    public beforeUnmount(): void {
        document.removeEventListener('click', this.onClickOutside);
    }

    public onSelect(option: number): void {
        if (option !== this.modelValue) {
            this.$emit('update:modelValue', option);
        }

        this.showOptions = false;
    }

    private onClickOutside(event: Event): void {
        const path = event.composedPath();
        const target = event.target as HTMLElement;
        const container = this.$refs.container as HTMLElement;

        if (path && !path.includes(container) && !container.contains(target)) {
            this.showOptions = false;
        }
    }
}
</script>

<style lang="scss" scoped>
.estimation-selector-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    border: 2px solid var(--primary-colors-0-00);

    .value-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        transition: color 0.3s, background-color 0.3s;

        &:hover {
            cursor: pointer;
            color: var(--primary-colors-8-00);
            background-color: var(--primary-colors-0-00);
        }
    }

    .options {
        $width: 135%;

        box-sizing: border-box;
        position: absolute;
        display: flex;
        flex-direction: column;
        padding: 0.75vh;
        top: calc(100% + 6px);
        left: calc(50% - #{$width} / 2);
        width: $width;
        background-color: var(--primary-colors-8-00);
        opacity: 0;
        animation: fade-in 0.2s ease forwards;

        .lightsource-panel {
            z-index: 0;
            position: absolute;
            opacity: 0.75;
            transform: rotateX(180deg);
        }

        span {
            z-index: 1;
            padding: 0.3vh 1vh;
            border-radius: 4px;
            font-size: var(--font-sizes-300);
            text-align: center;
            transition: background-color 0.1s;

            &:hover {
                cursor: pointer;
                background-color: var(--primary-colors-7-00);
            }
        }
    }
}
</style>
