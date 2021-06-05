<template>
    <div class="current-date-time-container">
        <span class="time">{{ time }}</span>
        <span class="date">{{ date }}</span>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class CurrentDateTime extends Vue {
    private current = new Date();

    get time(): string {
        return this.current.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        });
    }

    get date(): string {
        return this.current.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
.current-date-time-container {
    display: flex;
    flex-direction: column;
    align-items: center;

    .time {
        font-size: var(--font-sizes-900);
    }

    .date {
        font-size: var(--font-sizes-700);
    }
}
</style>
