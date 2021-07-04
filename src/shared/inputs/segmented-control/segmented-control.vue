<template>
    <display-panel class="segmented-control-container">
        <span class="title">{{ title }}</span>

        <div class="buttons">
            <toggle-button class="button"
                :icon="options[0].icon"
                :isActive="options[0].isActive"
                @click="onSelect(options[0])">
            </toggle-button>

            <toggle-button class="button"
                v-for="(option, index) of options.slice(1, -1)"
                :key="index"
                :type="'middle'"
                :icon="option.icon"
                :isActive="option.isActive"
                @click="onSelect(option)">
            </toggle-button>

            <toggle-button class="button"
                :type="'right'"
                :icon="options.slice(-1)[0].icon"
                :isActive="options.slice(-1)[0].isActive"
                @click="onSelect(options.slice(-1)[0])">
            </toggle-button>
        </div>
    </display-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import { ControlButtonOption } from '../../../core/models/generic/control-button-option';
import ToggleButton from '../../buttons/toggle-button/toggle-button.vue';
import DisplayPanel from '../../panels/display-panel/display-panel.vue';

class SegmentedControlProp {
    public title = prop<string>({ default: '' });
    public options = prop<ControlButtonOption[]>({ default: null });
}

@Options({
    components: {
        ToggleButton,
        DisplayPanel
    },
    emits: ['select']
})
export default class SegmentedControl extends Vue.with(SegmentedControlProp) {

    public onSelect(option: ControlButtonOption): void {
        if (!option.isActive) {
            this.options.forEach(_ => _.isActive = false);
            option.isActive = true;
            this.$emit('select', option);
        }
    }
}
</script>

<style lang="scss" scoped>
.segmented-control-container {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 0.5vh 2.25vh;
    background-color: var(--primary-colors-8-03);

    .title {
        text-transform: uppercase;
        text-shadow: 0 0 4px var(--font-colors-5-00);
        font-size: var(--font-sizes-200);
    }

    .buttons {
        display: flex;

        .button:not(:first-child) {
            margin-left: -0.3vh;
        }
    }
}
</style>
