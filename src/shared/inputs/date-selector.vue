<template>
    <div class="date-selector-container" ref="container">
        <div class="current-date-wrapper"
            :class="{ active: showOptions }"
            @click="showOptions = !showOptions">

            <template v-if="selected">
                <span>{{ selectedMonthAndDate }}</span>
                <span class="date-suffix">{{ selectedDateSuffix }}</span>
                <span>, {{ selected.getFullYear() }}</span>
                <close-circle-outline class="clear-button" @click.stop="$emit('update:modelValue', null)" />
            </template>

            <span v-if="!selected">N/A</span>
        </div>

        <display-panel v-if="showOptions" class="selection-panel">
            <lightsource-panel class="lightsource-panel"></lightsource-panel>

            <div class="month-selection">
                <chevron-left class="page-arrow"
                    :class="{ 'disabled-arrow': !allowPreviousMonth }"
                    @click="moveMonth(false)" />

                <span>{{ panelMonthAndYear }}</span>
                <chevron-right class="page-arrow" @click="moveMonth(true)" />
            </div>

            <div class="day-headers">
                <div class="header"
                    v-for="(letter, index) in letters"
                    :key="index"
                    :style="{ 'animation-delay': 0.1 + Math.abs(3 - index) * 0.025 + 's' }">

                    <span>{{ letter }}</span>
                </div>
            </div>

            <div class="row" v-for="row in rows" :key="row">
                <div class="day"
                    v-for="column in 7"
                    :key="column"
                    :class="getDayOptionClasses(row, column)"
                    @click="onDateSelect(row, column)">

                    <span>{{ getDate(row, column).getDate() }}</span>
                </div>
            </div>
        </display-panel>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { ChevronLeft, ChevronRight, CloseCircleOutline } from 'mdue';

import { ClassConfig } from '../../core/models/generic/class-config';
import { TimeUtility } from '../../core/utilities/time-utility/time-utility';
import DisplayPanel from '../../shared/panels/display-panel.vue';
import LightsourcePanel from '../../shared/panels/lightsource-panel.vue';

class DateSelectorProp {
    public modelValue = prop<Date>({ default: null });
}

@Options({
    components: {
        ChevronLeft,
        ChevronRight,
        CloseCircleOutline,
        DisplayPanel,
        LightsourcePanel
    },
    emits: ['update:modelValue']
})
export default class DateSelector extends Vue.with(DateSelectorProp) {
    public readonly letters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    public days = [31, -1, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    public panelDate = this.selected ? new Date(this.selected) : new Date();
    public showOptions = false;
    public rows = 0;
    private columnOffset = 0;
    private rowOffset = 0;

    get selected(): Date | null {
        return this.modelValue ? new Date(this.modelValue) : null;
    }

    get selectedMonthAndDate(): string {
        return this.selected ? `${TimeUtility.getMonthName(this.selected.getMonth())} ${this.selected.getDate()}` : '';
    }

    get selectedDateSuffix(): string {
        return this.selected ? TimeUtility.getDateSuffix(this.selected.getDate()) : '';
    }

    get allowPreviousMonth(): boolean {
        const now = new Date();

        return this.panelDate.getFullYear() > now.getFullYear() || this.panelDate.getMonth() > now.getMonth();
    }

    get panelMonthAndYear(): string {
        const month = TimeUtility.getMonthName(this.panelDate.getMonth());

        return `${month.slice(0, 3)} ${this.panelDate.getFullYear()}`;
    }

    public created(): void {
        this.setConstraints();
    }

    public mounted(): void {
        document.addEventListener('click', this.onClickOutside);
    }

    public beforeUnmount(): void {
        document.removeEventListener('click', this.onClickOutside);
    }

    public getDayOptionClasses(row: number, column: number): ClassConfig {
        const date = this.getDate(row, column);

        return {
            'unselectable-day': !this.isSelectable(date),
            'today': new Date().toLocaleDateString() === date.toLocaleDateString(),
            'selected-day': this.selected?.toLocaleDateString() === date.toLocaleDateString()
        };
    }

    public moveMonth(isNext: boolean): void {
        if (!isNext && !this.allowPreviousMonth) {
            return;
        }

        if (isNext && this.panelDate.getMonth() === 11) {
            this.panelDate = new Date(this.panelDate.getFullYear() + 1, 0);
        }
        else if (!isNext && !this.panelDate.getMonth()) {
            this.panelDate = new Date(this.panelDate.getFullYear() - 1, 11);
        }
        else {
            const month = this.panelDate.getMonth() + (isNext ? 1 : -1);
            this.panelDate = new Date(this.panelDate.getFullYear(), month);
        }

        this.setConstraints();
    }

    public onDateSelect(row: number, column: number): void {
        const date = this.getDate(row, column);

        if (this.isSelectable(date)) {
            this.showOptions = false;
            this.$emit('update:modelValue', date);
        }
    }

    public getDate(row: number, column: number): Date {
        const [month, year] = [this.panelDate.getMonth(), this.panelDate.getFullYear()];
        const dayCount = (this.rowOffset + row - 1) * 7 + column;

        if (dayCount <= this.columnOffset) {
            return new Date(year - 1, 11, dayCount - this.columnOffset + this.days.slice(-1)[0]);
        }

        const dayOffset = dayCount - this.getPrefixSum(month);

        if (dayOffset <= 0) {
            return new Date(year, month - 1, this.days[month - 1] + dayOffset);
        }
        else if (dayOffset <= this.days[month]) {
            return new Date(year, month, dayOffset);
        }
        else if (month === 11) {
            return new Date(year + 1, 0, dayOffset - this.days[month]);
        }

        return new Date(year, month + 1, dayOffset - this.days[month]);
    }

    private isSelectable(date: Date): boolean {
        const [year, month] = [this.panelDate.getFullYear(), this.panelDate.getMonth()];

        if (date.getFullYear() !== year || date.getMonth() !== month) {
            return false;
        }

        const target = date.toLocaleDateString().split('/').reverse().join('/');
        const current = new Date().toLocaleDateString().split('/').reverse().join('/');

        return target >= current;
    }

    private setConstraints(): void {
        const [month, year] = [this.panelDate.getMonth(), this.panelDate.getFullYear()];
        this.days[1] = TimeUtility.isLeapYear(year) ? 29 : 28;
        this.columnOffset = new Date(year, 0, 1).getDay();
        this.rowOffset = Math.floor(this.getPrefixSum(month) / 7);
        this.rows = Math.floor((this.getPrefixSum(month + 1) - 1) / 7) - this.rowOffset + 1;
    }

    private getPrefixSum(month: number, includeOffset = true): number {
        const offset = includeOffset ? this.columnOffset : 0;

        return this.days.slice(0, month).reduce((total, _) => _ + total, 0) + offset;
    }

    private onClickOutside(event: Event): void {
        const path = event.composedPath();
        const target = event.target as HTMLElement;
        const container = this.$refs.container as HTMLElement;

        if (path && !path.includes(container) && !container.contains(target)) {
            this.showOptions = false;
        }
    }
}
</script>

<style lang="scss" scoped>
.date-selector-container {
    position: relative;
    display: flex;
    justify-content: center;

    .current-date-wrapper {
        display: flex;
        align-items: center;
        padding: 0.35vh 1vh;
        width: 100%;
        height: 100%;
        border-radius: 3px;
        background-color: var(--primary-colors-7-02);
        transition: background-color 0.3s;

        &:hover, &.active {
            cursor: pointer;
            background-color: var(--primary-colors-7-07);
        }

        .date-suffix {
            align-self: flex-start;
            margin-left: 0.1vh;
            font-size: var(--font-sizes-200);
        }

        .clear-button {
            margin-left: 0.5vh;
            font-size: var(--font-sizes-300);
            transition: color 0.2s;

            &:hover {
                cursor: pointer;
                color: var(--context-colors-warning-00);
            }
        }
    }

    .selection-panel {
        $grid-dimension: var(--font-sizes-500);
        $selection-color: rgb(240, 123, 14);

        display: flex;
        flex-direction: column;
        align-items: center;
        position: absolute;
        z-index: 999;
        bottom: 120%;
        padding: 1.5vh 1.75vh 1vh 1.75vh;
        background-color: var(--primary-colors-8-00);
        opacity: 0;
        animation: fade-in 0.2s ease forwards;

        .lightsource-panel {
            z-index: -1;
            position: absolute;
            opacity: 0.75;
            transform: rotateX(180deg);
        }

        .month-selection {
            display: flex;
            align-items: center;
            justify-content: space-around;
            padding: 0 2vh;
            margin-bottom: 0.75vh;
            width: 100%;
            color: var(--font-colors-0-00);

            .page-arrow {
                transition: color 0.2s;

                &:hover {
                    cursor: pointer;
                    color: $selection-color;
                }

                &.disabled-arrow, &.disabled-arrow:hover {
                    cursor: default;
                    color: var(--font-colors-5-00);
                }
            }
        }

        .day-headers, .row {
            display: flex;
            justify-content: space-between;
            width: 100%;
        }

        .day-headers {
            margin-bottom: 0.75vh;
            height: $grid-dimension;

            .header {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0.35vh;
                width: $grid-dimension;
                height: $grid-dimension;
                color: var(--font-colors-0-00);
                opacity: 0;
                animation: fade-in 0.2s ease forwards;

                &:not(:first-of-type) {
                    margin-left: 0.75vh;
                }

                &:nth-child(1), &:nth-last-child(1) {
                    color: rgb(74, 236, 223);
                }
            }
        }

        .row {
            margin-bottom: 0.5vh;
            opacity: 0;
            animation: fade-in 0.3s ease 0.1s forwards;

            .day {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0.35vh;
                width: $grid-dimension;
                min-width: $grid-dimension;
                height: $grid-dimension;
                min-height: $grid-dimension;
                transition: background-color 0.2s, color 0.1s;

                &:not(:first-of-type) {
                    margin-left: 0.75vh;
                }

                &:not(.unselectable-day):hover {
                    cursor: pointer;
                    background-color: $selection-color;
                }

                &.unselectable-day {
                    color: var(--font-colors-5-00);
                    transition: none;
                }

                &.today {
                    background-color: var(--primary-colors-8-00);
                }

                &.selected-day {
                    background-color: $selection-color;
                    color: var(--font-colors-9-00);
                }
            }
        }
    }
}
</style>
