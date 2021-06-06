<template>
    <div class="work-item-status-menu-container">
        <component v-for="option of options"
            :key="option.status"
            :class="getClasses(option.status)"
            :is="option.icon">
        </component>
    </div>
</template>

<script lang="ts">
import { markRaw } from 'vue';
import { Options, Vue, prop } from 'vue-class-component';
import { CheckboxMarkedCircleOutline, PlayCircle, Target } from 'mdue';

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
    }
})
export default class WorkItemStatusMenu extends Vue.with(WorkItemStatusMenuProp) {
    public options = [
        { icon: markRaw(Target), status: WorkItemStatus.Highlighted },
        { icon: markRaw(PlayCircle), status: WorkItemStatus.Ongoing },
        { icon: markRaw(CheckboxMarkedCircleOutline), status: WorkItemStatus.Completed }
    ];

    public created(): void {
        const active = this.options.find(_ => _.status === this.activeOption);

        if (active) {
            const inactive = this.options.filter(_ => _.status !== this.activeOption);
            this.options = [inactive[0], active, ...inactive.slice(1)];
        }
    }

    public getClasses(status: WorkItemStatus): { [key: string]: boolean } {
        return {
            icon: true,
            'invisible-option': !this.showOptions,
            'active-option': this.activeOption === status
        };
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
        color: var(--font-colors-500);
        font-size: var(--font-sizes-00);
        transition: font-size 0.1s, opacity 0.05s, color 0.3s;

        &.invisible-option {
            opacity: 0;
        }

        &:hover, &.active-option {
            cursor: pointer;
            color: var(--font-colors-100);
            font-size: var(--font-sizes-600);
            opacity: 1;
        }
    }
}
</style>
