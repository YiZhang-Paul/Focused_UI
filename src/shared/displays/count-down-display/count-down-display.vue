<template>
    <div class="count-down-display-container">
        <template v-if="target">
            <span>{{ hours }}</span>
            <span>:{{ minutes }}:</span>
            <span>{{ seconds }}</span>
        </template>

        <span v-if="!target">-- : -- : --</span>
    </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';

class CountDownDisplayProp {
    public target = prop<Date>({ default: null });
}

export default class CountDownDisplay extends Vue.with(CountDownDisplayProp) {
    private readonly second = 1000;
    private readonly minute = this.second * 60;
    private readonly hour = this.minute * 60;
    private current = new Date();

    get hours(): string {
        return String(Math.floor(this.remain / this.hour)).padStart(2, '0');
    }

    get minutes(): string {
        return String(Math.floor(this.remain % this.hour / this.minute)).padStart(2, '0');
    }

    get seconds(): string {
        return String(Math.floor(this.remain % this.minute / this.second)).padStart(2, '0');
    }

    get remain(): number {
        return this.target ? Math.max(0, this.target.getTime() - this.current.getTime()) : 0;
    }

    public created(): void {
        this.updateDateTime();
    }

    private updateDateTime(): void {
        this.current = new Date();
        setTimeout(() => this.updateDateTime(), 1000);
    }
}
</script>

<style lang="scss" scoped>
.count-down-display-container {
    display: flex;
    align-items: center;
    justify-content: center;

    span {
        white-space: nowrap;
    }
}
</style>
