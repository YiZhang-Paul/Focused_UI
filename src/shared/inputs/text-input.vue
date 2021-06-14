<template>
    <div class="text-input-container">
        <span v-if="!isEditMode" @click="onEditStart()">{{ modelValue }}</span>

        <input v-if="isEditMode"
            type="text"
            ref="inputBox"
            v-model="current"
            :maxlength="maxLength"
            @keyup.enter="onEditEnd()"
            @keyup.esc="isEditMode = false"
            @blur="isEditMode = false" />
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

class TextInputProp {
    public modelValue = prop<string>({ default: '' });
    public maxLength = prop<number>({ default: 65 });
}

@Options({
    emits: ['update:modelValue']
})
export default class TextInput extends Vue.with(TextInputProp) {
    public current = this.modelValue;
    public isEditMode = false;

    public onEditStart(): void {
        this.isEditMode = true;
        setTimeout(() => (this.$refs.inputBox as HTMLElement).focus());
    }

    public onEditEnd(): void {
        const value = this.current?.trim() ?? '';

        if (value) {
            this.$emit('update:modelValue', value);
            this.isEditMode = false;
        }
    }
}
</script>

<style lang="scss" scoped>
.text-input-container {
    display: flex;

    & > span, & > input {
        flex: 1;
        padding: 0.5vh 0.75vh;
        border-radius: 4px;
        font-size: inherit;
    }

    & > span {
        transition: background-color 0.3s;

        &:hover {
            cursor: pointer;
            background-color: var(--primary-colors-7-02);
        }
    }

    & > input {
        border: none;
        outline: none;
        color: var(--font-colors-0-00);
        background-color: var(--primary-colors-7-00);
    }
}
</style>
