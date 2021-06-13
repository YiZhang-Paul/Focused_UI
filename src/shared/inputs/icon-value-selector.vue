<template>
    <div class="icon-value-selector-container" ref="container">
        <component v-if="selectedOption"
            class="icon"
            :is="selectedOption.icon"
            :style="{ color: `var(--${selectedOption.colorType}-00)` }"
            @click="showOptions = !showOptions">
        </component>

        <display-panel class="options" v-if="showOptions">
            <lightsource-panel class="lightsource-panel"></lightsource-panel>

            <span v-for="(option, index) of options" :key="index" @click="onSelect(option.value)">
                {{ option.description }}
            </span>
        </display-panel>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import { IconSelectionOption } from '../../core/models/generic/icon-selection-option';
import DisplayPanel from '../panels/display-panel.vue';
import LightsourcePanel from '../panels/lightsource-panel.vue';

class IconValueSelectorProp {
    public modelValue = prop<any>({ default: null });
    public options = prop<IconSelectionOption<any>[]>({ default: [] });
}

@Options({
    components: {
        DisplayPanel,
        LightsourcePanel
    },
    emits: ['update:modelValue']
})
export default class IconValueSelector extends Vue.with(IconValueSelectorProp) {
    public showOptions = false;

    get selectedOption(): IconSelectionOption<any> | null {
        return this.options.find(_ => _.value === this.modelValue) ?? null;
    }

    public mounted(): void {
        document.addEventListener('click', this.onClickOutside);
    }

    public beforeUnmount(): void {
        document.removeEventListener('click', this.onClickOutside);
    }

    public onSelect(option: any): void {
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
.icon-value-selector-container {
    display: flex;
    position: relative;

    .icon {
        cursor: pointer;
    }

    .options {
        $width: 20vh;

        z-index: 999;
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
            position: absolute;
            opacity: 0.75;
            transform: rotateX(180deg);
        }

        span {
            z-index: 999;
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
