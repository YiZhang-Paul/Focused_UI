<template>
    <div class="creation-button-container">
        <svg width="59" height="60" viewBox="0 0 59 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M55.5 1.5H48.3675C47.1632 1.5 45.9992 1.93474 45.0897 2.72429L1.68888 40.402C1.25131 40.7818 1 41.3328 1 41.9122V56.5C1 57.6046 1.89543 58.5 3 58.5H55.5C56.6046 58.5 57.5 57.6046 57.5 56.5V3.5C57.5 2.39543 56.6046 1.5 55.5 1.5Z" />
        </svg>

        <plus class="icon" />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Plus } from 'mdue';

@Options({
    components: { Plus }
})
export default class CreationButton extends Vue {}
</script>

<style lang="scss" scoped>
.creation-button-container {
    position: relative;
    cursor: pointer;

    &:hover {

        path {
            fill: rgb(41, 110, 31);
        }

        .icon {
            color: var(--font-colors-0-00);
        }
    }

    path {
        fill: rgb(31, 86, 23);
        stroke: rgb(49, 164, 31);
        stroke-opacity: 0.8;
        stroke-width: 2;
        transition: fill 0.3s;
    }

    .icon {
        position: absolute;
        bottom: 0.625rem;
        right: 0.625rem;
        color: var(--font-colors-2-00);
        font-size: var(--font-sizes-700);
        transition: color 0.3s;
    }
}
</style>
