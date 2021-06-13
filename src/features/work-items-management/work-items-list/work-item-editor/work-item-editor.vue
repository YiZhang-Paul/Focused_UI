<template>
    <display-panel v-if="item"
        class="work-item-editor-container"
        :lineLength="'1vh'"
        :corners="[false, false, true, true]">

        <close class="close-button" @click="$emit('item:close')" />
        <div class="content"></div>

        <div class="footer">
            <action-button class="delete-button"
                :text="'delete'"
                :type="buttonType.Warning"
                @click="$emit('item:delete', item)">
            </action-button>

            <div class="creation-time">
                <span>
                    created on:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {{ getTime(item.timeInfo.created) }}
                </span>

                <span>
                    last modified:&nbsp;&nbsp;
                    {{ getTime(item.timeInfo.lastModified) }}
                </span>
            </div>
        </div>
    </display-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { Close } from 'mdue';

import { WorkItem } from '../../../../core/models/work-item/work-item';
import { ActionButtonType } from '../../../../core/enums/action-button-type.enum';
import ActionButton from '../../../../shared/buttons/action-button.vue';
import DisplayPanel from '../../../../shared/panels/display-panel.vue';

class WorkItemEditorProp {
    public item = prop<WorkItem>({ default: null });
}

@Options({
    components: {
        Close,
        ActionButton,
        DisplayPanel
    },
    emits: [
        'item:close',
        'item:delete',
    ]
})
export default class WorkItemEditor extends Vue.with(WorkItemEditorProp) {
    public readonly buttonType = ActionButtonType;

    public getTime(time: string): string {
        if (!time) {
            return '';
        }

        return new Date(time).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    }
}
</script>

<style lang="scss" scoped>
.work-item-editor-container {
    $content-height: 85%;

    position: relative;
    box-sizing: border-box;
    padding: 3% 7.5%;
    background: linear-gradient(
        269.98deg,
        var(--primary-colors-7-02) 0.02%,
        var(--primary-colors-7-01) 99.98%
    );

    .close-button {
        position: absolute;
        top: 2.75vh;
        right: 2.75vh;
        color: var(--primary-colors-2-00);
        transition: color 0.3s;

        &:hover {
            cursor: pointer;
            color: var(--context-colors-warning-00);
        }
    }

    .content {
        height: $content-height;
    }

    .footer {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: calc(100% - #{$content-height});

        .delete-button {
            position: absolute;
        }

        .creation-time {
            display: flex;
            flex-direction: column;
            position: absolute;
            right: 2.5vh;
            font-size: var(--font-sizes-300);

            span {
                color: var(--font-colors-0-05);
            }

            span:first-of-type {
                margin-bottom: 0.5vh;
            }
        }
    }
}
</style>
