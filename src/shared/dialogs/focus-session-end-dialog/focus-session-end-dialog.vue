<template>
    <div class="focus-session-end-dialog-container">
        <div class="header">
            <alert class="icon" />
            <span>Focus Session Ended</span>
        </div>

        <div class="focus-change">
            <span>Today's Focus</span>
            <span class="change-value">{{ focusChange }}</span>
        </div>

        <div class="break-notice">
            <span>break session will start:</span>

            <div class="break-duration">
                <component class="icon" :is="breakIcon.content"></component>
                <span>{{ breakDuration }} Minutes</span>
            </div>
        </div>

        <detail-display-panel class="actions">
            <action-button :text="'ok'"
                :type="buttonType.Confirm"
                @click="$emit('dialog:confirm', stopOption)">
            </action-button>
        </detail-display-panel>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { Alert } from 'mdue';

import { FocusSessionDto } from '../../../core/dtos/focus-session-dto';
import { FocusSessionStopOption } from '../../../core/models/time-session/focus-session-stop-option';
import { IconMeta } from '../../../core/models/generic/icon-meta';
import { ActionButtonType } from '../../../core/enums/action-button-type.enum';
import { TimeSessionStatus } from '../../../core/enums/time-session-status.enum';
import { GenericUtility } from '../../../core/utilities/generic-utility/generic-utility';
import { IconUtility } from '../../../core/utilities/icon-utility/icon-utility';
import ActionButton from '../../buttons/action-button/action-button.vue';
import DetailDisplayPanel from '../../panels/detail-display-panel/detail-display-panel.vue';

class FocusSessionEndDialogProp {
    public data = prop<FocusSessionDto>({ default: null });
}

@Options({
    components: {
        Alert,
        ActionButton,
        DetailDisplayPanel
    },
    emits: ['dialog:confirm']
})
export default class FocusSessionEndDialog extends Vue.with(FocusSessionEndDialogProp) {
    public readonly buttonType = ActionButtonType;

    get stopOption(): FocusSessionStopOption {
        return new FocusSessionStopOption(this.data.id, this.breakDuration);
    }

    get focusChange(): string {
        const { regular, recurring, overlearning } = this.data.activities;
        const total = regular + recurring + overlearning;

        return `+${GenericUtility.roundTo(total / 8 * 100, 1)}%`;
    }

    get breakIcon(): IconMeta {
        return IconUtility.getTimeSessionIcon(TimeSessionStatus.Resting);
    }

    get breakDuration(): number {
        const oneMinute = 1000 * 60;
        const start = new Date(this.data.startTime).getTime();
        const elapsed = (Date.now() - start) / oneMinute;

        return Math.round(elapsed / 5);
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

    .header, .focus-change, .break-notice, .actions {
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

    .focus-change {
        color: var(--context-colors-confirm-00);
        font-size: var(--font-sizes-500);

        .change-value {
            margin-left: 1.25vh;
            font-size: var(--font-sizes-800);
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
        width: 20%;
        height: 13.5%;
    }
}
</style>
