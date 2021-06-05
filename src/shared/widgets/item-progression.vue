<template>
    <div class="item-progression-container" :class="{ completed: isCompleted }">
        <component class="icon" :is="progressIcon"></component>
        <span class="counters">{{ progress.current }}/{{ progress.target }}</span>
    </div>
</template>

<script lang="ts">
import { markRaw } from 'vue';
import { Vue, prop } from 'vue-class-component';
import { FileTree } from 'mdue';

import { ProgressionCounter } from '../../core/models/generic/progression-counter';

class ItemProgressionProp {
    public icon = prop<any>({ default: null });
    public progress = prop<ProgressionCounter<number>>({ default: null });
}

export default class ItemProgression extends Vue.with(ItemProgressionProp) {

    get isCompleted(): boolean {
        return this.progress.current === this.progress.target;
    }

    get progressIcon(): any {
        return this.icon ?? markRaw(FileTree);
    }
}
</script>

<style lang="scss" scoped>
.item-progression-container {
    display: flex;
    justify-content: center;
    align-items: flex-end;

    &.completed {
        color: var(--font-colors-500);
    }

    .icon {
        font-size: var(--font-sizes-500);
    }

    .counters {
        margin-left: 7px;
    }
}
</style>
