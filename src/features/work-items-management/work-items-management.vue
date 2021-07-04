<template>
    <content-view-panel class="work-items-management-container">
        <dialog-panel v-if="focusSessionOption"
            :dialog="focusSessionStartDialog"
            :data="focusSessionOption"
            @dialog:cancel="focusSessionOption = null"
            @dialog:confirm="onFocusSessionStart($event)">
        </dialog-panel>

        <dialog-panel v-if="showStopFocusSessionDialog"
            :dialog="focusSessionEndDialog"
            :data="activeFocusSession"
            @dialog:cancel="showStopFocusSessionDialog = false"
            @dialog:confirm="onFocusSessionEnd($event)">
        </dialog-panel>

        <dialog-panel v-if="showStopBreakSessionDialog"
            :dialog="breakSessionEndDialog"
            :data="activeBreakSession"
            :width="'30vw'"
            :height="'35vh'"
            @dialog:cancel="showStopBreakSessionDialog = false"
            @dialog:confirm="onBreakSessionEnd($event)">
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
                <session-tracker class="session-tracker" @session:stop="showSessionEndDialog()"></session-tracker>

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
                    @item:stop="onItemStop()">
                </work-items-list>
            </display-panel>

            <work-item-progress-stats-group class="stats-group"></work-item-progress-stats-group>
        </div>
    </content-view-panel>
</template>

<script lang="ts">
import { markRaw } from 'vue';
import { Options, Vue } from 'vue-class-component';

import { workItemKey } from '../../store/work-item/work-item.state';
import { timeSessionKey } from '../../store/time-session/time-session.state';
import { FocusSessionDto } from '../../core/dtos/focus-session-dto';
import { WorkItemDto } from '../../core/dtos/work-item-dto';
import { BreakSession } from '../../core/models/time-session/break-session';
import { WorkItem } from '../../core/models/work-item/work-item';
import { WorkItemQuery } from '../../core/models/work-item/work-item-query';
import { FocusSessionStartupOption } from '../../core/models/time-session/focus-session-startup-option';
import { FocusSessionStopOption } from '../../core/models/time-session/focus-session-stop-option';
import { BreakSessionStartupOption } from '../../core/models/time-session/break-session-startup-option';
import { BreakSessionStopOption } from '../../core/models/time-session/break-session-stop-option';
import CreationButton from '../../shared/buttons/creation-button/creation-button.vue';
import DialogPanel from '../../shared/panels/dialog-panel/dialog-panel.vue';
import DisplayPanel from '../../shared/panels/display-panel/display-panel.vue';
import ContentViewPanel from '../../shared/panels/content-view-panel/content-view-panel.vue';
import FocusSessionStartDialog from '../../shared/dialogs/focus-session-start-dialog/focus-session-start-dialog.vue';
import FocusSessionEndDialog from '../../shared/dialogs/focus-session-end-dialog/focus-session-end-dialog.vue';
import BreakSessionEndDialog from '../../shared/dialogs/break-session-end-dialog/break-session-end-dialog.vue';
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
        'item:update',
        'item:delete'
    ]
})
export default class WorkItemsManagement extends Vue {
    public readonly focusSessionStartDialog = markRaw(FocusSessionStartDialog);
    public readonly focusSessionEndDialog = markRaw(FocusSessionEndDialog);
    public readonly breakSessionEndDialog = markRaw(BreakSessionEndDialog);
    public focusSessionOption: FocusSessionStartupOption | null = null;
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

    get activeBreakSession(): BreakSession | null {
        return this.$store.getters[`${timeSessionKey}/activeBreakSession`];
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

    public showSessionEndDialog(): void {
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

        if (!await this.$store.dispatch(`${timeSessionKey}/stopFocusSession`, option)) {
            this.showStopFocusSessionDialog = true;
        }

        if (!breakOption.totalMinutes || await this.$store.dispatch(`${timeSessionKey}/startBreakSession`, breakOption)) {
            await this.loadWorkItems();
        }
    }

    public async onBreakSessionEnd(option: BreakSessionStopOption): Promise<void> {
        this.showStopBreakSessionDialog = false;
        const isStopped = await this.$store.dispatch(`${timeSessionKey}/stopBreakSession`, option);

        if (isStopped) {
            await this.loadWorkItems();
        }
        else {
            this.showStopBreakSessionDialog = true;
        }
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
            this.focusSessionOption = new FocusSessionStartupOption(item);
        }
        else if (await this.$store.dispatch(`${workItemKey}/startWorkItem`, item.id)) {
            this.$emit('item:update');
        }
    }

    public async onItemStop(): Promise<void> {
        if (await this.$store.dispatch(`${workItemKey}/stopWorkItem`)) {
            this.$emit('item:update');
        }
    }

    public async loadWorkItems(): Promise<void> {
        await this.$store.dispatch(`${workItemKey}/loadWorkItems`, this.query);
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
