<template>
    <div class="current-date-time-container">
        <div class="time">
            <span>{{ time }}</span>
            <component class="icon" :is="timeIcon.content" :style="{ color: timeIcon.color }"></component>
        </div>

        <div class="date">
            <span>{{ date }}</span>
            <span class="suffix">{{ dateSuffix }}</span>
            <span>, {{ year }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

import { IconMeta } from '../../../core/models/generic/icon-meta';
import { TimeUtility } from '../../../core/utilities/time-utility/time-utility';
import { IconUtility } from '../../../core/utilities/icon-utility/icon-utility';

export default class CurrentDateTime extends Vue {
    private current = new Date();

    get time(): string {
        return this.current.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        });
    }

    get timeIcon(): IconMeta {
        return IconUtility.getTimeIcon(this.current);
    }

    get date(): string {
        return this.current.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    }

    get dateSuffix(): string {
        return TimeUtility.getDateSuffix(this.current.getDate());
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
        display: flex;
        align-items: center;
        font-size: var(--font-sizes-900);

        .icon {
            margin-left: 1vh;
        }
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
