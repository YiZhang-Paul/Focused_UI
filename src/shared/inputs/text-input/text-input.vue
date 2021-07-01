<template>
    <div class="text-input-container">
        <template v-if="!isEditMode">
            <span v-if="modelValue" @click="onEditStart()">{{ modelValue }}</span>
            <span v-if="!modelValue" class="placeholder" @click="onEditStart()">{{ placeholder }}</span>
        </template>

        <input v-if="isEditMode"
            type="text"
            ref="inputBox"
            v-model="current"
            :maxlength="maxLength"
            @input="onEdit()"
            @keyup.enter="onEditEnd()"
            @keyup.esc="isEditMode = false"
            @blur="isEditMode = false" />
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

class TextInputProp {
    public modelValue = prop<string>({ default: '' });
    public placeholder = prop<string>({ default: '' });
    public isEmptyAllowed = prop<boolean>({ default: false });
    public isInstantUpdate = prop<boolean>({ default: false });
    public maxLength = prop<number>({ default: 85 });
}

@Options({
    watch: {
        modelValue(): void {
            this.current = this.modelValue;
        }
    },
    emits: ['update:modelValue']
})
/* istanbul ignore next */
export default class TextInput extends Vue.with(TextInputProp) {
    public current = this.modelValue;
    public isEditMode = false;

    public onEditStart(): void {
        this.isEditMode = true;
        setTimeout(() => (this.$refs.inputBox as HTMLElement).focus());
    }

    public onEdit(): void {
        const value = this.current?.trim() ?? '';

        if (this.isInstantUpdate && value !== this.modelValue) {
            this.$emit('update:modelValue', value);
        }
    }

    public onEditEnd(): void {
        const value = this.current?.trim() ?? '';

        if (!this.isInstantUpdate && value !== this.modelValue && (value || this.isEmptyAllowed)) {
            this.$emit('update:modelValue', value);
        }

        this.current = value;
        this.isEditMode = this.isEmptyAllowed ? false : !value;
    }
}
</script>

<style lang="scss" scoped>
.text-input-container {
    display: flex;

    .placeholder {
        color: var(--font-colors-5-00);
    }

    & > span, & > input {
        flex: 1;
        padding: 0.5vh 0.75vh;
        border-radius: 4px;
        text-align: inherit;
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
