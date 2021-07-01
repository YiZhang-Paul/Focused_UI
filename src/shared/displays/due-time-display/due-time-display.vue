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
/* istanbul ignore next */
export default class DueTimeDisplay extends Vue.with(DueTimeDisplayProp) {
    public readonly oneHour = 60 * 60 * 1000;

    get dueTimeText(): string {
        if (!this.date || this.dueTime > 24) {
            return '';
        }

        if (this.dueTime <= 0) {
            return 'past due';
        }

        if (this.dueTime < 1) {
            const minutes = this.dueTime * 60;

            return `due in ${minutes.toFixed(0)} minute${minutes > 1 ? 's' : ''}`;
        }

        return `due in ${this.dueTime.toFixed(0)} hour${this.dueTime > 1 ? 's' : ''}`;
    }

    get dueTime(): number {
        const date = this.date ? new Date(this.date) : null;

        if (!date) {
            return 0;
        }

        const time = (date.getTime() - Date.now()) / this.oneHour;

        return time > 0.999 ? Math.round(time) : time;
    }
}
</script>

<style lang="scss" scoped>
.due-time-display-container {
    color: var(--font-colors-3-00);

    &.alert {
        color: var(--context-colors-warning-00);
    }
}
</style>
