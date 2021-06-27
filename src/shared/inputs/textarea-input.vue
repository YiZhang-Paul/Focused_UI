<template>
    <overlay-scroll-panel class="textarea-input-container">
        <div class="content">
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
    </overlay-scroll-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { Check, Close } from 'mdue';

import OverlayScrollPanel from '../panels/overlay-scroll-panel/overlay-scroll-panel.vue';

class TextareaInputProp {
    public modelValue = prop<string>({ default: '' });
    public maxLength = prop<number>({ default: 1000 });
}

@Options({
    components: {
        Check,
        Close,
        OverlayScrollPanel
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
        if (this.current !== this.modelValue) {
            this.$emit('update:modelValue', this.current);
        }

        this.isEditMode = false;
        this.isBlurIgnored = false;
    }
}
</script>

<style lang="scss" scoped>
.textarea-input-container {
    border-radius: 4px;
    transition: background-color 0.3s;

    &:hover {
        cursor: pointer;
        background-color: var(--primary-colors-7-02);
    }

    .content {
        position: relative;
        display: flex;
        width: 100%;
        height: 100%;

        & > span, textarea {
            box-sizing: border-box;
            padding: 0.75vh 1vh;
            width: 100%;
        }

        & > span {
            white-space: pre-wrap;
            word-wrap: break-word;
        }

        textarea {
            border: none;
            outline: none;
            resize: none;
            color: var(--font-colors-0-00);
            background-color: var(--primary-colors-7-00);
            font-size: inherit;
            font-family: inherit;
        }

        .action-buttons {
            display: flex;
            align-items: center;
            position: absolute;
            bottom: 0.5vh;
            right: 2vh;

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
                margin-left: 0.5vh;
                color: var(--context-colors-warning-05);

                &:hover {
                    color: var(--context-colors-warning-00);
                }
            }
        }
    }
}
</style>
