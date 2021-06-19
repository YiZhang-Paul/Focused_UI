<template>
    <display-panel class="search-box-container">
        <input type="text" placeholder="search here..." @keyup="onSearch($event.target.value)" />
    </display-panel>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import DisplayPanel from '../panels/display-panel.vue';

@Options({
    components: { DisplayPanel },
    emits: ['search']
})
export default class SearchBox extends Vue {
    // eslint-disable-next-line no-undef
    private debounceTimer: NodeJS.Timeout | null = null;
    private lastSearched = '';

    public onSearch(text: string): void {
        const searchText = text?.trim() ?? '';

        if (searchText === this.lastSearched) {
            return;
        }

        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = setTimeout(() => {
            this.$emit('search', searchText);
            this.lastSearched = searchText;
        }, 200);
    }
}
</script>

<style lang="scss" scoped>
.search-box-container {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 0 1.5vh;
    background-color: var(--primary-colors-8-03);

    input {
        background-color: transparent;
        width: 100%;
        border: none;
        outline: none;
        color: var(--font-colors-0-00);
        font-size: var(--font-sizes-400);
    }
}
</style>
