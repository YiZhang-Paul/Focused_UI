<template>
    <div class="estimation-selector-container">
        <display-panel class="options">
            <span v-for="(option, index) of options" :key="index">
                {{ transform ? transform(option) : option }}
            </span>
        </display-panel>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import DisplayPanel from '../panels/display-panel.vue';

class EstimationSelectorProp {
    public options = prop<number[]>({ default: [] });
    public transform = prop<() => string>({ default: null });
}

@Options({
    components: { DisplayPanel }
})
export default class EstimationSelector extends Vue.with(EstimationSelectorProp) {}
</script>

<style lang="scss" scoped>
.estimation-selector-container {
    position: relative;

    .options {
        position: absolute;
        display: flex;
        flex-direction: column;
        padding: 0.75vh;
        top: calc(-100% + 5px);
        background-color: var(--primary-colors-8-00);

        span {
            padding: 0.3vh 1.5vh;
            border-radius: 4px;
            font-size: var(--font-sizes-300);
            text-align: right;
            transition: background-color 0.1s;

            &:hover {
                cursor: pointer;
                background-color: var(--primary-colors-7-00);
            }
        }
    }
}
</style>
