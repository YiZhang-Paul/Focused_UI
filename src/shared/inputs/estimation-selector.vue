<template>
    <div class="estimation-selector-container">
        <div class="value-wrapper" @click="showOptions = !showOptions">
            <span>{{ transform ? transform(modelValue) : modelValue }}</span>
        </div>

        <display-panel class="options" v-if="showOptions">
            <span v-for="(option, index) of options" :key="index" @click="onSelect(option)">
                {{ transform ? transform(option) : option }}
            </span>
        </display-panel>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import DisplayPanel from '../panels/display-panel.vue';

class EstimationSelectorProp {
    public modelValue = prop<number>({ default: 0 });
    public options = prop<number[]>({ default: [] });
    public transform = prop<() => string>({ default: null });
}

@Options({
    components: { DisplayPanel },
    emits: ['update:modelValue']
})
export default class EstimationSelector extends Vue.with(EstimationSelectorProp) {
    public showOptions = false;

    public onSelect(option: number): void {
        this.$emit('update:modelValue', option);
        this.showOptions = false;
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
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
    }

    .options {
        box-sizing: border-box;
        position: absolute;
        display: flex;
        flex-direction: column;
        padding: 0.75vh;
        top: calc(100% + 6px);
        width: 100%;
        background-color: var(--primary-colors-8-00);

        span {
            padding: 0.3vh 1.5vh;
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
