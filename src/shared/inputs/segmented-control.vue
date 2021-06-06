<template>
    <display-panel class="segmented-control-container">
        <span class="title">{{ title }}</span>

        <div class="buttons">
            <toggle-button class="button" :option="options[0]"></toggle-button>

            <toggle-button class="button"
                v-for="(option, index) of options.slice(1, -1)"
                :key="index"
                :type="'middle'"
                :option="option">
            </toggle-button>

            <toggle-button class="button" :type="'right'" :option="options.slice(-1)[0]"></toggle-button>
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
    }
})
export default class SegmentedControl extends Vue.with(SegmentedControlProp) {}
</script>

<style lang="scss" scoped>
.segmented-control-container {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 0.5vh 2.5vh;
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
