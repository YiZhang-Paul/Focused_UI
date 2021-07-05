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
import { Vue } from 'vue-class-component';

import { performanceKey } from '../../../store/performance/performance.state';
import { StyleConfig } from '../../../core/models/generic/style-config';
import { ProgressionCounter } from '../../../core/models/generic/progression-counter';

export default class DailyFocusProgression extends Vue {

    get progression(): ProgressionCounter<number> | null {
        return this.$store.getters[`${performanceKey}/currentDayProgression`];
    }

    get hoursFocused(): string {
        const { current } = this.progression!;
        const total = current ? current.toFixed(1) : '0';

        return `${total} hour${current > 1 ? 's' : ''}`;
    }

    get percentage(): string {
        const { current, target } = this.progression!;

        return `${Math.round(current / target * 100)}%`;
    }

    get percentageStyle(): StyleConfig {
        let type = 'warning';
        const { current } = this.progression!;

        if (current < 6) {
            type = 'alert';
        }
        else if (current < 12) {
            type = 'positive';
        }

        return {
            color: `var(--context-colors-${type}-00)`,
            'text-shadow': `0 0 8px var(--context-colors-${type}-05)`
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
