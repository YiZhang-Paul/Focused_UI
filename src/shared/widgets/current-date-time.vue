<template>
    <div class="current-date-time-container">
        <span class="time">{{ time }}</span>

        <div class="date">
            <span>{{ date }}</span>
            <span class="suffix">{{ dateSuffix }}</span>
            <span>, {{ year }}</span>
        </div>
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
        const date = this.current.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return date.replace(/, \d+/, '');
    }

    get dateSuffix(): string {
        const date = this.current.getDate().toString();

        if (date !== '11' && date.endsWith('1')) {
            return 'st';
        }

        if (date !== '12' && date.endsWith('2')) {
            return 'nd';
        }

        if (date !== '13' && date.endsWith('3')) {
            return 'rd';
        }

        return 'th';
    }

    get year(): number {
        return this.current.getFullYear();
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
        display: flex;
        font-size: var(--font-sizes-700);

        .suffix {
            align-self: flex-start;
            margin-left: 2px;
            font-size: var(--font-sizes-400);
        }
    }
}
</style>
