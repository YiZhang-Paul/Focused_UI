<template>
    <div v-if="data" class="ratings-change-dialog-container">
        <div class="header">
            <shield-star class="icon" />
            <span>Ratings Changed</span>
        </div>

        <div class="changes">
            <div class="change"
                v-for="change of changes"
                :key="change.icon.name"
                :class="{ gain: change.value > 0, lose: change.value < 0 }">

                <component class="icon" :is="change.icon.content"></component>
                <span>{{ change.value }}%</span>
            </div>
        </div>

        <detail-display-panel class="actions">
            <action-button :text="'ok'"
                :type="buttonType.Confirm"
                @click="$emit('dialog:confirm')">
            </action-button>
        </detail-display-panel>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { ShieldStar } from 'mdue';

import { ValueChange } from '../../../core/models/generic/value-change';
import { IconMeta } from '../../../core/models/generic/icon-meta';
import { PerformanceRating } from '../../../core/models/user/performance-rating';
import { ActionButtonType } from '../../../core/enums/action-button-type.enum';
import { UserRating } from '../../../core/enums/user-rating.enum';
import { GenericUtility } from '../../../core/utilities/generic-utility/generic-utility';
import { IconUtility } from '../../../core/utilities/icon-utility/icon-utility';
import ActionButton from '../../buttons/action-button/action-button.vue';
import DetailDisplayPanel from '../../panels/detail-display-panel/detail-display-panel.vue';

class RatingsChangeDialogProp {
    public data = prop<ValueChange<PerformanceRating>>({ default: null });
}

@Options({
    components: {
        ShieldStar,
        ActionButton,
        DetailDisplayPanel
    },
    emits: ['dialog:confirm']
})
/* istanbul ignore next */
export default class RatingsChangeDialog extends Vue.with(RatingsChangeDialogProp) {
    public readonly buttonType = ActionButtonType;

    get changes(): { value: number; icon: IconMeta }[] {
        const { previous, current } = this.data;

        return [
            {
                value: GenericUtility.roundTo((current.determination - previous.determination) * 100, 1),
                icon: IconUtility.getUserRatingIcon(UserRating.Determination)
            },
            {
                value: GenericUtility.roundTo((current.estimation - previous.estimation) * 100, 1),
                icon: IconUtility.getUserRatingIcon(UserRating.Estimation)
            },
            {
                value: GenericUtility.roundTo((current.planning - previous.planning) * 100, 1),
                icon: IconUtility.getUserRatingIcon(UserRating.Planning)
            },
            {
                value: GenericUtility.roundTo((current.adaptability - previous.adaptability) * 100, 1),
                icon: IconUtility.getUserRatingIcon(UserRating.Adaptability)
            },
            {
                value: GenericUtility.roundTo((current.sustainability - previous.sustainability) * 100, 1),
                icon: IconUtility.getUserRatingIcon(UserRating.Sustainability)
            }
        ];
    }
}
</script>

<style lang="scss" scoped>
.ratings-change-dialog-container {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    padding-top: 1vh;
    padding-bottom: 2.5vh;

    .header, .changes, .actions {
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

    .changes {
        font-size: var(--font-sizes-600);

        .change {
            display: flex;
            align-items: center;
            justify-content: center;

            &.gain {
                color: var(--context-colors-positive-00);
            }

            &.lose {
                color: var(--context-colors-warning-00);
            }

            .icon {
                margin-right: 0.5vh;
                font-size: var(--font-sizes-700);
            }
        }

        .change:not(:first-child) {
            margin-left: 1.75vh;
        }
    }

    .actions {
        width: 20%;
        height: 20%;
    }
}
</style>
