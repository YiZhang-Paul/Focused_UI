<template>
    <div class="focus-session-end-dialog-container">
        <div class="header">
            <alert class="icon" />
            <span>End of Session</span>
        </div>

        <div class="break-notice">
            <span>break session will start:</span>

            <div class="break-duration">
                <component class="icon" :is="breakIcon.content"></component>
                <span>5 Minutes</span>
            </div>
        </div>

        <detail-display-panel class="actions">
            <action-button :text="'cancel'" @click="$emit('dialog:cancel')"></action-button>

            <action-button class="stop-button"
                :text="'ok'"
                :type="buttonType.Confirm"
                @click="$emit('dialog:confirm')">
            </action-button>
        </detail-display-panel>
    </div>
</template>

<script lang="ts">
import { markRaw } from 'vue';
import { Options, Vue, prop } from 'vue-class-component';
import { Alert, FormatListCheckbox } from 'mdue';

import { FocusSessionDto } from '../../../core/dtos/focus-session-dto';
import { IconMeta } from '../../../core/models/generic/icon-meta';
import { ActionButtonType } from '../../../core/enums/action-button-type.enum';
import { TimeSessionStatus } from '../../../core/enums/time-session-status.enum';
import { IconUtility } from '../../../core/utilities/icon-utility/icon-utility';
import ActionButton from '../../../shared/buttons/action-button/action-button.vue';
import DetailDisplayPanel from '../../../shared/panels/detail-display-panel/detail-display-panel.vue';

class FocusSessionEndDialogProp {
    public data = prop<FocusSessionDto>({ default: null });
}

@Options({
    components: {
        Alert,
        ActionButton,
        DetailDisplayPanel
    },
    emits: [
        'dialog:cancel',
        'dialog:confirm'
    ]
})
export default class FocusSessionEndDialog extends Vue.with(FocusSessionEndDialogProp) {
    public readonly buttonType = ActionButtonType;
    public readonly checklistIcon = markRaw(FormatListCheckbox);

    get breakIcon(): IconMeta {
        return IconUtility.getTimeSessionIcon(TimeSessionStatus.Resting);
    }
}
</script>

<style lang="scss" scoped>
.focus-session-end-dialog-container {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    padding-top: 1vh;
    padding-bottom: 2.5vh;

    .header, .break-notice, .actions {
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

    .break-notice {
        flex-direction: column;
        height: 15%;
        font-size: var(--font-sizes-300);
        opacity: 0;
        animation: fade-in 0.2s ease 0.4s forwards;

        .break-duration {
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

        .stop-button {
            margin-left: 1vh;
        }
    }
}
</style>
