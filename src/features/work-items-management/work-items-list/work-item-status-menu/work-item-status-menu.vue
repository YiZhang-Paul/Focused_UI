<template>
    <div class="work-item-status-menu-container">
        <component v-for="option of options"
            :key="option.status"
            :class="getClasses(option.status)"
            :is="option.icon"
            @click="onSelect(option.status)">
        </component>
    </div>
</template>

<script lang="ts">
import { markRaw } from 'vue';
import { Options, Vue, prop } from 'vue-class-component';
import { CheckboxMarkedCircleOutline, PlayCircle, Target } from 'mdue';

import { ClassConfig } from '../../../../core/models/generic/class-config';
import { WorkItemStatus } from '../../../../core/enums/work-item-status.enum';

class WorkItemStatusMenuProp {
    public activeOption = prop<WorkItemStatus>({ default: null });
    public showOptions = prop<boolean>({ default: false });
}

@Options({
    components: {
        CheckboxMarkedCircleOutline,
        PlayCircle,
        Target
    },
    watch: {
        activeOption(): void {
            this.initializeOptions();
        }
    },
    emits: [
        'select',
        'start',
        'stop'
    ]
})
/* istanbul ignore next */
export default class WorkItemStatusMenu extends Vue.with(WorkItemStatusMenuProp) {
    public options: { icon: any; status: WorkItemStatus }[] = [];

    public created(): void {
        this.initializeOptions();
    }

    public getClasses(status: WorkItemStatus): ClassConfig {
        return {
            icon: true,
            ongoing: status === WorkItemStatus.Ongoing,
            'invisible-option': !this.showOptions,
            'active-option': this.activeOption === status
        };
    }

    public onSelect(status: WorkItemStatus): void {
        if (this.activeOption === WorkItemStatus.Ongoing) {
            this.$emit('stop', status === WorkItemStatus.Ongoing ? WorkItemStatus.Idle : status);
        }
        else if (status === WorkItemStatus.Ongoing) {
            this.$emit('start');
        }
        else {
            this.$emit('select', status === this.activeOption ? WorkItemStatus.Idle : status);
        }
    }

    private initializeOptions(): void {
        this.options = [
            { icon: markRaw(Target), status: WorkItemStatus.Highlighted },
            { icon: markRaw(PlayCircle), status: WorkItemStatus.Ongoing },
            { icon: markRaw(CheckboxMarkedCircleOutline), status: WorkItemStatus.Completed }
        ]

        const active = this.options.find(_ => _.status === this.activeOption);

        if (active) {
            const inactive = this.options.filter(_ => _.status !== this.activeOption);
            this.options = [inactive[0], active, ...inactive.slice(1)];
        }
    }
}
</script>

<style lang="scss" scoped>
.work-item-status-menu-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;

    .icon {
        color: var(--font-colors-6-00);
        font-size: var(--font-sizes-400);
        transition: font-size 0.1s, opacity 0.05s, color 0.2s;

        &.invisible-option {
            opacity: 0;
        }

        &:hover, &.active-option {
            cursor: pointer;
            font-size: var(--font-sizes-600);
            opacity: 1;
        }

        &.active-option {
            color: var(--font-colors-1-00);
        }

        &.active-option.ongoing {
            color: var(--context-colors-alert-00);
        }
    }
}
</style>
