<template>
    <div class="focus-session-stop-dialog-container">
        <div class="header">
            <alert class="icon" />
            <span>{{ isStale ? 'Focus Session Ended' : 'Stop Session?' }}</span>
        </div>

        <detail-display-panel class="item-breakdown">
            <overlay-scroll-panel class="items">
                <item-completion-breakdown :items="data.workItems"></item-completion-breakdown>
            </overlay-scroll-panel>
        </detail-display-panel>

        <div class="focus-change">
            <span>Today's Focus</span>
            <span class="change-value">{{ focusChange }}</span>
        </div>

        <div class="break-notice">
            <span v-if="breakDuration">break session will start:</span>
            <span v-if="!breakDuration">no breaks for session under {{ breakEligibleDuration }} minutes:</span>

            <div class="break-duration">
                <component class="icon" :is="breakIcon.content"></component>
                <span>{{ breakDuration }} Minute{{ breakDuration ? 's' : '' }}</span>
            </div>
        </div>

        <detail-display-panel v-if="isStale" class="confirm-actions">
            <action-button :text="'ok'"
                :type="buttonType.Confirm"
                @click="$emit('dialog:confirm', stopOption)">
            </action-button>
        </detail-display-panel>

        <detail-display-panel v-if="!isStale" class="stop-actions">
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

import { FocusSessionDto } from '../../../core/dtos/focus-session-dto';
import { FocusSessionStopOption } from '../../../core/models/time-session/focus-session-stop-option';
import { IconMeta } from '../../../core/models/generic/icon-meta';
import { ActionButtonType } from '../../../core/enums/action-button-type.enum';
import { TimeSessionStatus } from '../../../core/enums/time-session-status.enum';
import { GenericUtility } from '../../../core/utilities/generic-utility/generic-utility';
import { IconUtility } from '../../../core/utilities/icon-utility/icon-utility';
import ActionButton from '../../buttons/action-button/action-button.vue';
import ItemCompletionBreakdown from '../../displays/item-completion-breakdown/item-completion-breakdown.vue';
import DetailDisplayPanel from '../../panels/detail-display-panel/detail-display-panel.vue';
import OverlayScrollPanel from '../../panels/overlay-scroll-panel/overlay-scroll-panel.vue';

class FocusSessionStopDialogProp {
    public data = prop<FocusSessionDto>({ default: null });
}

@Options({
    components: {
        Alert,
        ActionButton,
        ItemCompletionBreakdown,
        DetailDisplayPanel,
        OverlayScrollPanel
    },
    emits: [
        'dialog:cancel',
        'dialog:confirm'
    ]
})
export default class FocusSessionStopDialog extends Vue.with(FocusSessionStopDialogProp) {
    public readonly oneMinute = 1000 * 60;
    public readonly oneHour = this.oneMinute * 60;
    public readonly breakEligibleDuration = 15;
    public readonly buttonType = ActionButtonType;

    get stopOption(): FocusSessionStopOption {
        return new FocusSessionStopOption(this.data.id, this.breakDuration);
    }

    get isStale(): boolean {
        return this.targetEnd <= Date.now();
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
        const start = new Date(this.data.startTime).getTime();
        const end = Math.min(this.targetEnd, Date.now());
        const elapsed = (end - start) / this.oneMinute;

        return elapsed >= this.breakEligibleDuration ? Math.round(elapsed / 5) : 0;
    }

    get targetEnd(): number {
        const { startTime, targetDuration } = this.data;

        return new Date(startTime).getTime() + targetDuration * this.oneHour;
    }
}
</script>

<style lang="scss" scoped>
.focus-session-stop-dialog-container {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    padding-top: 1vh;
    padding-bottom: 2.5vh;

    .header, .item-breakdown, .focus-change, .break-notice, .confirm-actions, .stop-actions {
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

    .item-breakdown {
        box-sizing: border-box;
        padding: 0.5vh 0.75vh;
        width: 85%;
        height: 35%;

        .items {
            width: 100%;
            height: 100%;
        }
    }

    .focus-change {
        color: var(--context-colors-positive-00);
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

    .stop-actions {
        width: 35%;
        height: 13.5%;

        .stop-button {
            margin-left: 1vh;
        }
    }

    .confirm-actions {
        width: 20%;
        height: 13.5%;
    }
}
</style>
