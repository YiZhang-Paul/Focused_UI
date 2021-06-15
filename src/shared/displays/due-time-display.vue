<template>
    <span class="due-time-display-container" :class="{ alert: dueTime <= 1 }">
        {{ dueTimeText }}
    </span>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';

class DueTimeDisplayProp {
    public date = prop<string>({ default: null });
}

export default class DueTimeDisplay extends Vue.with(DueTimeDisplayProp) {
    public readonly oneHour = 60 * 60 * 1000;

    get dueTimeText(): string {
        if (!this.date || this.dueTime > 24) {
            return '';
        }

        if (this.dueTime <= 0) {
            return 'past due';
        }

        if (this.dueTime <= 1) {
            const minutes = this.dueTime * 60;

            return `due in ${minutes.toFixed(0)} minute${minutes > 1 ? 's' : ''}`;
        }

        return `due in ${this.dueTime.toFixed(0)} hour${this.dueTime > 1 ? 's' : ''}`;
    }

    get dueTime(): number {
        const date = this.date ? new Date(this.date) : null;

        return date ? (date.getTime() - Date.now()) / this.oneHour : 0;
    }
}
</script>

<style lang="scss" scoped>
.due-time-display-container {

    &.alert {
        color: var(--context-colors-warning-00);
    }
}
</style>
