<template>
    <div class="textarea-input-container">
        <span v-if="!isEditMode" @click="onEditStart()">
            {{ modelValue?.trim() ? modelValue : 'no description available.' }}
        </span>

        <template v-if="isEditMode">
            <textarea ref="textareaBox"
                v-model="current"
                :maxlength="maxLength"
                @keyup.esc="isEditMode = false"
                @blur="isEditMode = isBlurIgnored">
            </textarea>

            <div class="action-buttons">
                <check class="save-button"
                    @mouseover="isBlurIgnored = true"
                    @mouseout="isBlurIgnored = false"
                    @click="onEditEnd()" />

                <close class="cancel-button" />
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { Check, Close } from 'mdue';

class TextareaInputProp {
    public modelValue = prop<string>({ default: '' });
    public maxLength = prop<number>({ default: 1000 });
}

@Options({
    components: {
        Check,
        Close
    },
    emits: ['update:modelValue']
})
export default class TextareaInput extends Vue.with(TextareaInputProp) {
    public current = this.modelValue;
    public isEditMode = false;
    public isBlurIgnored = false;

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
            this.isBlurIgnored = false;
        }
    }
}
</script>

<style lang="scss" scoped>
.textarea-input-container {
    position: relative;
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

    .action-buttons {
        display: flex;
        align-items: center;
        position: absolute;
        bottom: 0.5vh;
        right: 1.75vh;

        .save-button, .cancel-button {
            cursor: pointer;
            font-size: var(--font-sizes-600);
            transition: color 0.3s;
        }

        .save-button {
            color: var(--context-colors-confirm-05);

            &:hover {
                color: var(--context-colors-confirm-00);
            }
        }

        .cancel-button {
            margin-left: 0.25vh;
            color: var(--context-colors-warning-05);

            &:hover {
                color: var(--context-colors-warning-00);
            }
        }
    }
}
</style>
