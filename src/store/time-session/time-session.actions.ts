import { ActionContext, ActionTree } from 'vuex';

import { WorkItemAction } from '../work-item/work-item.actions';
import { workItemKey } from '../work-item/work-item.store';
import { FocusSessionStartupOption } from '../../core/models/time-session/focus-session-startup-option';
import { BreakSessionStartupOption } from '../../core/models/time-session/break-session-startup-option';
import { WorkItemStatus } from '../../core/enums/work-item-status.enum';
import { TimeSessionHttpService } from '../../core/services/http/time-session-http/time-session-http.service';

import { ITimeSessionState } from './time-session.state';
import { GettersAugments, TimeSessionGetter } from './time-session.getters';
import { ITimeSessionMutations, TimeSessionMutation } from './time-session.mutations';

let timeSessionHttpService: TimeSessionHttpService;

export enum TimeSessionAction {
    StartFocusSession = 'start_focus_session',
    StopFocusSession = 'stop_focus_session',
    StartOverlearning = 'start_overlearning',
    SwitchWorkItem = 'switch_work_item',
    StartBreakSession = 'start_break_session',
    StopBreakSession = 'stop_break_session',
    LoadActiveTimeSession = 'load_active_time_session',
    LoadStaleTimeSession = 'load_stale_time_session',
    SyncActiveTimeSession = 'sync_active_time_session'
}

interface ActionAugments extends Omit<ActionContext<ITimeSessionState, ITimeSessionState>, 'getters' | 'commit'> {
    getters: GettersAugments;
    commit<T extends keyof ITimeSessionMutations>(key: T, payload: Parameters<ITimeSessionMutations[T]>[1]): ReturnType<ITimeSessionMutations[T]>;
}

export interface ITimeSessionActions {
    [TimeSessionAction.StartFocusSession](context: ActionAugments, payload: FocusSessionStartupOption): Promise<boolean>;
    [TimeSessionAction.StopFocusSession](context: ActionAugments, id: string): Promise<boolean>;
    [TimeSessionAction.StartOverlearning](context: ActionAugments, targetStatus: WorkItemStatus): Promise<boolean>;
    [TimeSessionAction.SwitchWorkItem](context: ActionAugments, id: string): Promise<boolean>;
    [TimeSessionAction.StartBreakSession](context: ActionAugments, payload: BreakSessionStartupOption): Promise<boolean>;
    [TimeSessionAction.StopBreakSession](context: ActionAugments, id: string): Promise<boolean>;
    [TimeSessionAction.LoadActiveTimeSession](context: ActionAugments): Promise<void>;
    [TimeSessionAction.LoadStaleTimeSession](context: ActionAugments): Promise<void>;
    [TimeSessionAction.SyncActiveTimeSession](context: ActionAugments): Promise<void>;
}

export const setActionServices = (timeSessionHttp: TimeSessionHttpService): void => {
    timeSessionHttpService = timeSessionHttp;
}

export const actions: ActionTree<ITimeSessionState, ITimeSessionState> & ITimeSessionActions = {
    async [TimeSessionAction.StartFocusSession](context: ActionAugments, payload: FocusSessionStartupOption): Promise<boolean> {
        const isStarted = await timeSessionHttpService.startFocusSession(payload);

        if (isStarted) {
            await context.dispatch(TimeSessionAction.LoadActiveTimeSession);
        }

        return isStarted;
    },
    async [TimeSessionAction.StopFocusSession](context: ActionAugments, id: string): Promise<boolean> {
        const isStopped = await timeSessionHttpService.stopFocusSession(id);

        if (isStopped) {
            await context.dispatch(TimeSessionAction.LoadActiveTimeSession);
            await context.dispatch(TimeSessionAction.LoadStaleTimeSession);
        }

        return isStopped;
    },
    async [TimeSessionAction.StartOverlearning](context: ActionAugments, targetStatus: WorkItemStatus): Promise<boolean> {
        const isStarted = await timeSessionHttpService.startOverlearning(targetStatus);

        if (isStarted) {
            context.dispatch(`${workItemKey}/${WorkItemAction.ReloadWorkItems}`, null, { root: true });
            context.dispatch(TimeSessionAction.LoadActiveTimeSession);
        }

        return isStarted;
    },
    async [TimeSessionAction.SwitchWorkItem](context: ActionAugments, id: string): Promise<boolean> {
        const isSwitched = await timeSessionHttpService.switchWorkItem(id);

        if (isSwitched) {
            context.dispatch(`${workItemKey}/${WorkItemAction.ReloadWorkItems}`, null, { root: true });
            context.dispatch(TimeSessionAction.LoadActiveTimeSession);
        }

        return isSwitched;
    },
    async [TimeSessionAction.StartBreakSession](context: ActionAugments, payload: BreakSessionStartupOption): Promise<boolean> {
        if (!payload.totalMinutes) {
            return true;
        }

        const isStarted = await timeSessionHttpService.startBreakSession(payload);

        if (isStarted) {
            await context.dispatch(TimeSessionAction.LoadActiveTimeSession);
        }

        return isStarted;
    },
    async [TimeSessionAction.StopBreakSession](context: ActionAugments, id: string): Promise<boolean> {
        const isStopped = await timeSessionHttpService.stopBreakSession(id);

        if (isStopped) {
            await context.dispatch(TimeSessionAction.LoadActiveTimeSession);
            await context.dispatch(TimeSessionAction.LoadStaleTimeSession);
        }

        return isStopped;
    },
    async [TimeSessionAction.LoadActiveTimeSession](context: ActionAugments): Promise<void> {
        context.commit(TimeSessionMutation.SetActiveFocusSession, await timeSessionHttpService.getActiveFocusSessionMeta());
        context.commit(TimeSessionMutation.SetActiveBreakSession, await timeSessionHttpService.getActiveBreakSession());
    },
    async [TimeSessionAction.LoadStaleTimeSession](context: ActionAugments): Promise<void> {
        context.commit(TimeSessionMutation.SetStaleFocusSession, await timeSessionHttpService.getStaleFocusSessionMeta());
        context.commit(TimeSessionMutation.SetStaleBreakSession, await timeSessionHttpService.getStaleBreakSession());
    },
    async [TimeSessionAction.SyncActiveTimeSession](context: ActionAugments): Promise<void> {
        const { getters, commit, dispatch } = context;
        const focusSession = getters[TimeSessionGetter.ActiveFocusSession];
        const breakSession = getters[TimeSessionGetter.ActiveBreakSession];
        const hasSession = focusSession || breakSession;

        if (hasSession && !getters[TimeSessionGetter.HasOngoingTimeSession]) {
            await dispatch(TimeSessionAction.LoadStaleTimeSession);
            await dispatch(TimeSessionAction.LoadActiveTimeSession);
        }
        else if (focusSession) {
            commit(TimeSessionMutation.SetActiveFocusSession, { ...focusSession });
        }
        else if (breakSession) {
            commit(TimeSessionMutation.SetActiveBreakSession, { ...breakSession });
        }

        setTimeout(() => actions[TimeSessionAction.SyncActiveTimeSession](context), 1000);
    }
};
