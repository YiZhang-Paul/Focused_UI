<template>
    <div v-if="progression" class="daily-focus-progression-container">
        <div class="summary">
            <span>Today’s Focus</span>
            <span>{{ hoursFocused }}</span>
        </div>

        <span class="percentage" :style="percentageStyle">{{ percentage }}</span>
    </div>
</template>

<script lang="ts">
import { ProgressionCounter } from '@/core/models/generic/progression-counter';
import { Vue } from 'vue-class-component';

import store from '../../store';
import { performanceKey } from '../../store/performance/performance.state';

export default class DailyFocusProgression extends Vue {

    get progression(): ProgressionCounter<number> | null {
        return store.getters[`${performanceKey}/currentDayProgression`];
    }

    get hoursFocused(): string {
        const { current } = this.progression!;
        const total = current ? current.toFixed(1) : '0';

        return `${total} hour${current >= 1 ? 's' : ''}`;
    }

    get percentage(): string {
        const { current, target } = this.progression!;

        return `${Math.round(current / target * 100)}%`;
    }

    get percentageStyle(): { [key: string]: string } {
        let type = 'overdoing';
        const { current } = this.progression!;

        if (current < 6) {
            type = 'insufficient';
        }
        else if (current < 12) {
            type = 'sufficient';
        }

        return {
            color: `var(--focus-progress-colors-${type}-00)`,
            'text-shadow': `0 0 8px var(--focus-progress-colors-${type}-05)`
        };
    }
}
</script>

<style lang="scss" scoped>
.daily-focus-progression-container {
    display: flex;
    align-items: center;

    .summary {
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        span:first-of-type {
            font-size: var(--font-sizes-500);
        }

        span:last-of-type {
            margin-top: 1.25vh;
            font-size: var(--font-sizes-700);
        }
    }

    .percentage {
        margin-left: 1.75vh;
        font-size: var(--font-sizes-1000);
    }
}
</style>
