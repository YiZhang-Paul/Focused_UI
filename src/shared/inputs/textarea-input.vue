<template>
    <div class="textarea-input-container">
        <span v-if="!isEditMode" @click="onEditStart()">
            {{ modelValue?.trim() ? modelValue : 'no description available.' }}
        </span>

        <textarea v-if="isEditMode"
            ref="textareaBox"
            v-model="current"
            :maxlength="maxLength"
            @keyup.esc="isEditMode = false"
            @keyup.enter="onEditEnd()"
            @blur="isEditMode = false">
        </textarea>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

class TextareaInputProp {
    public modelValue = prop<string>({ default: '' });
    public maxLength = prop<number>({ default: 1000 });
}

@Options({
    emits: ['update:modelValue']
})
export default class TextareaInput extends Vue.with(TextareaInputProp) {
    public current = this.modelValue;
    public isEditMode = false;

    public onEditStart(): void {
        this.isEditMode = true;

        setTimeout(() => {
            const element = this.$refs.textareaBox as HTMLTextAreaElement;
            element.focus();
            element.setSelectionRange(0, 0);
            element.scrollTop = 0;
        });
    }

    public onEditEnd(): void {
        if (this.current) {
            this.$emit('update:modelValue', this.current);
            this.isEditMode = false;
        }
    }
}
</script>

<style lang="scss" scoped>
.textarea-input-container {
    display: flex;

    & > span, & > textarea {
        flex: 1;
        padding: 0.5vh 0.75vh;
        border-radius: 4px;
        font-size: inherit;
    }

    & > span {
        box-sizing: border-box;
        width: 0;
        height: 100%;
        overflow-y: auto;
        white-space: pre-wrap;
        word-wrap: break-word;
        transition: background-color 0.3s;

        &:hover {
            cursor: pointer;
            background-color: var(--primary-colors-7-02);
        }
    }

    & > textarea {
        border: none;
        outline: none;
        resize: none;
        color: var(--font-colors-0-00);
        background-color: var(--primary-colors-7-00);
        font-family: inherit;
    }
}
</style>
