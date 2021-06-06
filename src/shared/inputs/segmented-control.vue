<template>
    <display-panel class="segmented-control-container">
        <span class="title">{{ title }}</span>

        <div class="buttons">
            <toggle-button class="button"
                :option="options[0]"
                :isActive="activeIndex === 0"
                @click="onSelect(0)">
            </toggle-button>

            <toggle-button class="button"
                v-for="(option, index) of options.slice(1, -1)"
                :key="index"
                :type="'middle'"
                :option="option"
                :isActive="activeIndex === index + 1"
                @click="onSelect(index + 1)">
            </toggle-button>

            <toggle-button class="button"
                :type="'right'"
                :option="options.slice(-1)[0]"
                :isActive="activeIndex === options.length - 1"
                @click="onSelect(options.length - 1)">
            </toggle-button>
        </div>
    </display-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import { IconMeta } from '../../core/models/generic/icon-meta';
import ToggleButton from '../buttons/toggle-button.vue';
import DisplayPanel from '../panels/display-panel.vue';

class SegmentedControlProp {
    public title = prop<string>({ default: '' });
    public options = prop<IconMeta[]>({ default: null });
}

@Options({
    components: {
        ToggleButton,
        DisplayPanel
    },
    emits: ['select']
})
export default class SegmentedControl extends Vue.with(SegmentedControlProp) {
    public activeIndex = 0;

    public onSelect(index: number): void {
        if (this.activeIndex !== index) {
            this.activeIndex = index;
            this.$emit('select', this.options[index]);
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
    background-color: var(--primary-colors-803);

    .title {
        text-transform: uppercase;
        text-shadow: 0 0 4px var(--font-colors-500);
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
