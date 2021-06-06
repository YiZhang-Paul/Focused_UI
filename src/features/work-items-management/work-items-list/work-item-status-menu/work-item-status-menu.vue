<template>
    <div class="work-item-status-menu-container">
        <target :class="getClasses(workItemStatus.Highlighted)" />
        <play-circle :class="getClasses(workItemStatus.Ongoing)" />
        <checkbox-marked-circle-outline :class="getClasses(workItemStatus.Completed)" />
    </div>
</template>

<script lang="ts">
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
    public workItemStatus = WorkItemStatus;

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
        color: var(--font-colors-400);
        font-size: var(--font-sizes-400);
        transition: font-size 0.1s, opacity 0.1s, color 0.3s;

        &.invisible-option {
            opacity: 0;
        }

        &.active-option.invisible-option {
            position: absolute;
        }

        &:hover, &.active-option {
            cursor: pointer;
            color: var(--font-colors-000);
            font-size: var(--font-sizes-600);
            opacity: 1;
        }
    }
}
</style>
