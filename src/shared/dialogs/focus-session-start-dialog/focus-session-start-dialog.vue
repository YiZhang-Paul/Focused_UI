<template>
    <div v-if="data" class="focus-session-start-dialog-container">
        <div class="header">
            <alert class="icon" />
            <span>Start Session?</span>
        </div>

        <detail-display-panel class="item-information">
            <div class="title">
                <component class="icon"
                    :is="typeIcon.content"
                    :style="{ color: typeIcon.color }">
                </component>

                <span>{{ data.item.name }}</span>
            </div>

            <div class="description">
                <notebook-edit-outline class="icon" />
                <span>{{ data.item.description }}</span>
            </div>

            <div class="progressions">
                <item-progression class="subtask-progression"
                    :progress="data.item.subtaskProgress">
                </item-progression>

                <item-progression :icon="checklistIcon"
                    :progress="data.item.checklistProgress">
                </item-progression>
            </div>
        </detail-display-panel>

        <div class="duration-notice">
            <span>focus session will start:</span>

            <div class="duration-value">
                <lightbulb-on class="icon" />
                <span>{{ data.duration }} Minutes</span>
            </div>
        </div>

        <detail-display-panel class="actions">
            <action-button :text="'cancel'" @click="$emit('dialog:cancel')"></action-button>

            <action-button class="start-button"
                :text="'start'"
                :type="buttonType.Confirm"
                @click="$emit('dialog:confirm', startOption)">
            </action-button>
        </detail-display-panel>
    </div>
</template>

<script lang="ts">
import { markRaw } from 'vue';
import { Options, Vue, prop } from 'vue-class-component';
import { Alert, FormatListCheckbox, LightbulbOn, NotebookEditOutline } from 'mdue';

import { FocusSessionStartDialogOption } from '../../../core/models/time-session/focus-session-start-dialog-option';
import { FocusSessionStartupOption } from '../../../core/models/time-session/focus-session-startup-option';
import { IconMeta } from '../../../core/models/generic/icon-meta';
import { ActionButtonType } from '../../../core/enums/action-button-type.enum';
import { IconUtility } from '../../../core/utilities/icon-utility/icon-utility';
import ActionButton from '../../buttons/action-button/action-button.vue';
import DetailDisplayPanel from '../../panels/detail-display-panel/detail-display-panel.vue';
import ItemProgression from '../../displays/item-progression/item-progression.vue';

class FocusSessionStartDialogProp {
    public data = prop<FocusSessionStartDialogOption>({ default: null });
}

@Options({
    components: {
        Alert,
        LightbulbOn,
        NotebookEditOutline,
        ActionButton,
        DetailDisplayPanel,
        ItemProgression
    },
    emits: [
        'dialog:cancel',
        'dialog:confirm'
    ]
})
/* istanbul ignore next */
export default class FocusSessionStartDialog extends Vue.with(FocusSessionStartDialogProp) {
    public readonly buttonType = ActionButtonType;
    public readonly checklistIcon = markRaw(FormatListCheckbox);

    get startOption(): FocusSessionStartupOption {
        return new FocusSessionStartupOption(this.data.item.id, this.data.duration);
    }

    get typeIcon(): IconMeta {
        return IconUtility.getWorkItemIcon(this.data.item.type);
    }
}
</script>

<style lang="scss" scoped>
.focus-session-start-dialog-container {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    padding-top: 1vh;
    padding-bottom: 2.5vh;

    .header, .item-information, .duration-notice, .actions {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .header {
        width: 100%;
        height: 10%;
        font-size: var(--font-sizes-700);
        opacity: 0;
        animation: fade-in 0.3s ease 0.2s forwards;

        .icon {
            margin-right: 1.5vh;
        }
    }

    .item-information {
        box-sizing: border-box;
        flex-direction: column;
        justify-content: space-between;
        padding: 1vh 1% 0.5vh 1%;
        width: 85%;
        height: 35%;

        .title {
            display: flex;
            font-size: var(--font-sizes-500);

            .icon {
                margin-right: 0.75vh;
                font-size: var(--font-sizes-700);
            }
        }

        .description {
            box-sizing: border-box;
            display: flex;
            padding: 0 2.5%;
            color: var(--font-colors-2-00);
            font-size: var(--font-sizes-300);

            .icon {
                margin-right: 0.75vh;
                font-size: var(--font-sizes-700);
            }
        }

        .progressions {
            display: flex;
            align-items: center;
            align-self: flex-end;
            justify-content: center;
            margin-right: 1vh;

            .subtask-progression {
                margin-right: 1vh;
            }
        }
    }

    .duration-notice {
        flex-direction: column;
        height: 15%;
        font-size: var(--font-sizes-300);
        opacity: 0;
        animation: fade-in 0.2s ease 0.4s forwards;

        .duration-value {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 0.5vh;
            font-size: var(--font-sizes-700);

            .icon {
                margin-right: 0.5vh;
            }
        }
    }

    .actions {
        width: 35%;
        height: 13.5%;

        .start-button {
            margin-left: 1vh;
        }
    }
}
</style>
