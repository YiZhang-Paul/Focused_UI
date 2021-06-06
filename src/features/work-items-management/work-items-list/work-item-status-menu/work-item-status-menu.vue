<template>
    <div class="work-item-status-menu-container">
        <checkbox-marked-circle-outline class="icon" />
        <play-circle class="icon" />
        <target class="icon" />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { CheckboxMarkedCircleOutline, PlayCircle, Target } from 'mdue';

@Options({
    components: {
        CheckboxMarkedCircleOutline,
        PlayCircle,
        Target
    }
})
export default class WorkItemStatusMenu extends Vue {}
</script>

<style lang="scss" scoped>
.work-item-status-menu-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;

    .icon {
        color: var(--font-colors-400);
        font-size: var(--font-sizes-400);
        transition: font-size 0.1s, color 0.3s;

        &:hover {
            cursor: pointer;
            color: var(--font-colors-000);
            font-size: var(--font-sizes-600);
        }
    }
}
</style>
