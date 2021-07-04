<template>
    <div class="break-session-end-dialog-container">
        <div class="header">
            <alert class="icon" />
            <span>Stop Session?</span>
        </div>

        <detail-display-panel class="actions">
            <action-button :text="'cancel'" @click="$emit('dialog:cancel')"></action-button>

            <action-button class="stop-button"
                :text="'stop'"
                :type="buttonType.Warning"
                @click="$emit('dialog:confirm', stopOption)">
            </action-button>
        </detail-display-panel>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { Alert } from 'mdue';

import { BreakSession } from '../../../core/models/time-session/break-session';
import { BreakSessionStopOption } from '../../../core/models/time-session/break-session-stop-option';
import { ActionButtonType } from '../../../core/enums/action-button-type.enum';
import ActionButton from '../../../shared/buttons/action-button/action-button.vue';
import DetailDisplayPanel from '../../../shared/panels/detail-display-panel/detail-display-panel.vue';

class BreakSessionEndDialogProp {
    public data = prop<BreakSession>({ default: null });
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
export default class BreakSessionEndDialog extends Vue.with(BreakSessionEndDialogProp) {
    public readonly buttonType = ActionButtonType;

    get stopOption(): BreakSessionStopOption {
        return new BreakSessionStopOption(this.data.id);
    }
}
</script>

<style lang="scss" scoped>
.break-session-end-dialog-container {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;

    .header, .actions {
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

    .actions {
        width: 40%;
        height: 22.5%;

        .stop-button {
            margin-left: 1vh;
        }
    }
}
</style>
