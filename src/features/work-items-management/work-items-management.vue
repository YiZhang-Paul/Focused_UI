<template>
    <content-view-panel class="work-items-management-container">
        <dialog-panel v-if="focusSessionOption"
            :dialog="focusSessionStartDialog"
            :data="focusSessionOption"
            @dialog:cancel="focusSessionOption = null"
            @dialog:confirm="onFocusSessionStart($event)">
        </dialog-panel>

        <dialog-panel v-if="showStopFocusSessionDialog"
            :dialog="focusSessionStopDialog"
            :data="activeFocusSession"
            @dialog:cancel="showStopFocusSessionDialog = false"
            @dialog:confirm="onFocusSessionEnd($event)">
        </dialog-panel>

        <dialog-panel v-if="staleFocusSession"
            :dialog="focusSessionStopDialog"
            :data="staleFocusSession"
            @dialog:confirm="onFocusSessionEnd($event)">
        </dialog-panel>

        <dialog-panel v-if="showStopBreakSessionDialog"
            :dialog="breakSessionStopDialog"
            :data="activeBreakSession"
            :width="'30vw'"
            :height="'35vh'"
            @dialog:cancel="showStopBreakSessionDialog = false"
            @dialog:confirm="onBreakSessionEnd($event)">
        </dialog-panel>

        <dialog-panel v-if="staleBreakSession"
            :dialog="breakSessionEndDialog"
            :data="staleBreakSession"
            :width="'30vw'"
            :height="'35vh'"
            @dialog:confirm="onBreakSessionEnd($event)">
        </dialog-panel>

        <dialog-panel v-if="ratingsChangeOption"
            :dialog="ratingsChangeDialog"
            :data="ratingsChangeOption"
            :width="'35vw'"
            :height="'37.5vh'"
            @dialog:confirm="onRatingsUpdate()">
        </dialog-panel>

        <template v-slot:actions>
            <div class="actions">
                <creation-button @click="startCreate()"></creation-button>
                <work-item-filter class="item-filter" :query="query" @item:filter="loadWorkItems()"></work-item-filter>
            </div>
        </template>

        <div class="content">
            <work-item-tracking-stats-group class="stats-group"></work-item-tracking-stats-group>

            <display-panel class="core-content" :lineLength="'1.25vh'">
                <session-tracker class="session-tracker" @session:stop="showSessionStopDialog()"></session-tracker>

                <work-item-editor v-if="editedItemMeta && editedItem"
                    class="work-item-editor"
                    :meta="editedItemMeta"
                    :item="editedItem"
                    @item:close="onItemClose()"
                    @item:update="onItemUpdate(editedItem)"
                    @item:delete="onItemDelete(editedItem.id)">
                </work-item-editor>

                <work-items-list v-if="!editedItem"
                    class="work-items-list"
                    :pendingItem="pendingItem"
                    :editedItem="editedItem"
                    @create:cancel="cancelCreate()"
                    @create:confirm="confirmCreate()"
                    @update:meta="onItemMetaUpdate($event)"
                    @item:select="onItemSelect($event.id)"
                    @item:start="onItemStart($event)"
                    @item:stop="onItemStop($event)">
                </work-items-list>
            </display-panel>

            <work-item-progress-stats-group class="stats-group"></work-item-progress-stats-group>
        </div>
    </content-view-panel>
</template>

<script lang="ts">
import { markRaw } from 'vue';
import { Options, Vue } from 'vue-class-component';

import { userKey } from '../../store/user/user.state';
import { workItemKey } from '../../store/work-item/work-item.state';
import { timeSessionKey } from '../../store/time-session/time-session.state';
import { performanceKey } from '../../store/performance/performance.state';
import { FocusSessionDto } from '../../core/dtos/focus-session-dto';
import { WorkItemDto } from '../../core/dtos/work-item-dto';
import { ValueChange } from '../../core/models/generic/value-change';
import { WorkItem } from '../../core/models/work-item/work-item';
import { WorkItemQuery } from '../../core/models/work-item/work-item-query';
import { UserProfile } from '../../core/models/user/user-profile';
import { PerformanceRating } from '../../core/models/user/performance-rating';
import { FocusSessionStartDialogOption } from '../../core/models/time-session/focus-session-start-dialog-option';
import { FocusSessionStartupOption } from '../../core/models/time-session/focus-session-startup-option';
import { FocusSessionStopOption } from '../../core/models/time-session/focus-session-stop-option';
import { BreakSession } from '../../core/models/time-session/break-session';
import { BreakSessionStartupOption } from '../../core/models/time-session/break-session-startup-option';
import { WorkItemStatus } from '../../core/enums/work-item-status.enum';
import CreationButton from '../../shared/buttons/creation-button/creation-button.vue';
import DialogPanel from '../../shared/panels/dialog-panel/dialog-panel.vue';
import DisplayPanel from '../../shared/panels/display-panel/display-panel.vue';
import ContentViewPanel from '../../shared/panels/content-view-panel/content-view-panel.vue';
import FocusSessionStartDialog from '../../shared/dialogs/focus-session-start-dialog/focus-session-start-dialog.vue';
import FocusSessionStopDialog from '../../shared/dialogs/focus-session-stop-dialog/focus-session-stop-dialog.vue';
import BreakSessionStopDialog from '../../shared/dialogs/break-session-stop-dialog/break-session-stop-dialog.vue';
import BreakSessionEndDialog from '../../shared/dialogs/break-session-end-dialog/break-session-end-dialog.vue';
import RatingsChangeDialog from '../../shared/dialogs/ratings-change-dialog/ratings-change-dialog.vue';
import SessionTracker from '../../shared/widgets/session-tracker/session-tracker.vue';
import StatsBreakdown from '../../shared/widgets/stats-breakdown/stats-breakdown.vue';

import WorkItemTrackingStatsGroup from './work-item-tracking-stats-group/work-item-tracking-stats-group.vue';
import WorkItemProgressStatsGroup from './work-item-progress-stats-group/work-item-progress-stats-group.vue';
import WorkItemFilter from './work-item-filter/work-item-filter.vue';
import WorkItemEditor from './work-item-editor/work-item-editor.vue';
import WorkItemsList from './work-items-list/work-items-list.vue';

@Options({
    components: {
        CreationButton,
        DialogPanel,
        DisplayPanel,
        ContentViewPanel,
        SessionTracker,
        StatsBreakdown,
        WorkItemTrackingStatsGroup,
        WorkItemProgressStatsGroup,
        WorkItemFilter,
        WorkItemEditor,
        WorkItemsList
    },
    emits: [
        'session:stop',
        'item:update',
        'item:delete'
    ]
})
export default class WorkItemsManagement extends Vue {
    public readonly focusSessionStartDialog = markRaw(FocusSessionStartDialog);
    public readonly focusSessionStopDialog = markRaw(FocusSessionStopDialog);
    public readonly breakSessionStopDialog = markRaw(BreakSessionStopDialog);
    public readonly breakSessionEndDialog = markRaw(BreakSessionEndDialog);
    public readonly ratingsChangeDialog = markRaw(RatingsChangeDialog);
    public focusSessionOption: FocusSessionStartDialogOption | null = null;
    public ratingsChangeOption: ValueChange<PerformanceRating> | null = null;
    public showStopFocusSessionDialog = false;
    public showStopBreakSessionDialog = false;
    public query = new WorkItemQuery();

    get pendingItem(): WorkItemDto | null {
        return this.$store.getters[`${workItemKey}/pendingWorkItem`];
    }

    get editedItemMeta(): WorkItemDto | null {
        return this.$store.getters[`${workItemKey}/editedWorkItemMeta`];
    }

    get editedItem(): WorkItem | null {
        return this.$store.getters[`${workItemKey}/editedWorkItem`];
    }

    get activeFocusSession(): FocusSessionDto | null {
        return this.$store.getters[`${timeSessionKey}/activeFocusSession`];
    }

    get staleFocusSession(): FocusSessionDto | null {
        return this.$store.getters[`${timeSessionKey}/staleFocusSession`];
    }

    get activeBreakSession(): BreakSession | null {
        return this.$store.getters[`${timeSessionKey}/activeBreakSession`];
    }

    get staleBreakSession(): BreakSession | null {
        return this.$store.getters[`${timeSessionKey}/staleBreakSession`];
    }

    public created(): void {
        this.loadWorkItems();
    }

    public startCreate(): void {
        this.$store.commit(`${workItemKey}/setPendingWorkItem`, new WorkItemDto());
    }

    public cancelCreate(): void {
        this.$store.commit(`${workItemKey}/setPendingWorkItem`, null);
    }

    public async confirmCreate(): Promise<void> {
        const id = await this.$store.dispatch(`${workItemKey}/createWorkItem`);

        if (id) {
            await this.onItemSelect(id);
            await this.loadWorkItems();
        }
    }

    public showSessionStopDialog(): void {
        this.showStopFocusSessionDialog = Boolean(this.activeFocusSession);
        this.showStopBreakSessionDialog = Boolean(this.activeBreakSession);
    }

    public async onFocusSessionStart(option: FocusSessionStartupOption): Promise<void> {
        this.focusSessionOption = null;

        if (await this.$store.dispatch(`${timeSessionKey}/startFocusSession`, option)) {
            await this.loadWorkItems();
        }
    }

    public async onFocusSessionEnd(option: FocusSessionStopOption): Promise<void> {
        const breakOption = new BreakSessionStartupOption(option.focusSessionId, option.breakSessionDuration);
        this.showStopFocusSessionDialog = false;

        if (await this.$store.dispatch(`${timeSessionKey}/stopFocusSession`, option.focusSessionId)) {
            this.showRatingsChange();
            this.loadWorkItems();
            this.$store.dispatch(`${timeSessionKey}/startBreakSession`, breakOption);
            this.$emit('session:stop');
        }
        else {
            this.showStopFocusSessionDialog = true;
        }
    }

    public async onBreakSessionEnd(id: string): Promise<void> {
        this.showStopBreakSessionDialog = false;
        const isStopped = await this.$store.dispatch(`${timeSessionKey}/stopBreakSession`, id);

        if (isStopped) {
            await this.loadWorkItems();
        }
        else {
            this.showStopBreakSessionDialog = true;
        }
    }

    public onRatingsUpdate(): void {
        this.$store.dispatch(`${userKey}/updateUserRatings`, this.ratingsChangeOption!.current);
        this.ratingsChangeOption = null;
    }

    public async onItemMetaUpdate(item: WorkItemDto): Promise<void> {
        if (await this.$store.dispatch(`${workItemKey}/updateWorkItemMeta`, item)) {
            this.$emit('item:update');
        }
    }

    public onItemClose(): void {
        this.$store.commit(`${workItemKey}/setEditedWorkItem`, null);
    }

    public async onItemUpdate(item: WorkItem): Promise<void> {
        if (await this.$store.dispatch(`${workItemKey}/updateWorkItem`, item)) {
            this.$emit('item:update');
        }
    }

    public async onItemDelete(id: string): Promise<void> {
        if (await this.$store.dispatch(`${workItemKey}/deleteWorkItem`, id)) {
            this.$emit('item:delete');
        }
    }

    public async onItemSelect(id: string): Promise<void> {
        await this.$store.dispatch(`${workItemKey}/loadEditedWorkItem`, id);
    }

    public async onItemStart(item: WorkItemDto): Promise<void> {
        if (!this.$store.getters[`${timeSessionKey}/hasActiveFocusSession`]) {
            this.focusSessionOption = new FocusSessionStartDialogOption(item);
        }
        else if (await this.$store.dispatch(`${timeSessionKey}/switchWorkItem`, item.id)) {
            this.$emit('item:update');
        }
    }

    public async onItemStop(targetStatus: WorkItemStatus): Promise<void> {
        if (await this.$store.dispatch(`${timeSessionKey}/startOverlearning`, targetStatus)) {
            this.$emit('item:update');
        }
    }

    public async loadWorkItems(): Promise<void> {
        await this.$store.dispatch(`${workItemKey}/loadWorkItems`, this.query);
    }

    private async showRatingsChange(): Promise<void> {
        const user: UserProfile = this.$store.getters[`${userKey}/profile`];
        const ratings = await this.$store.dispatch(`${performanceKey}/getPerformanceRating`);
        this.ratingsChangeOption = new ValueChange(user.ratings, ratings);
    }
}
</script>

<style lang="scss" scoped>
.work-items-management-container {

    .actions, .content {
        width: 100%;
        height: 100%;
    }

    .actions {
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 7.5vh 0 2.5vh;

        .item-filter {
            margin-left: 1.75vh;
            width: 100%;
            height: 80%;
        }
    }

    .content {
        $gap: 5%;
        $core-content-width: 63.5%;

        display: flex;
        align-items: center;
        justify-content: space-evenly;

        .stats-group, .core-content {
            height: 95%;
        }

        .stats-group {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: calc((100% - #{$gap} - #{$core-content-width}) / 2);
        }

        .core-content {
            $tracker-height: 5.5vh;

            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            padding: 2.5vh 3.5vh;
            width: $core-content-width;
            background-color: var(--primary-colors-8-01);

            .session-tracker {
                width: 100%;
                height: $tracker-height;
            }

            .work-item-editor, .work-items-list {
                height: calc(100% - 1.5vh - #{$tracker-height});
            }

            .work-item-editor {
                width: 92.5%;
            }

            .work-items-list {
                width: 100%;
            }
        }
    }
}
</style>
