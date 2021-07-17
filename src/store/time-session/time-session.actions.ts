import { ActionContext, ActionTree } from 'vuex';

import { ActionKey as WorkItemActionKey } from '../work-item/work-item.actions';
import { FocusSessionStartupOption } from '../../core/models/time-session/focus-session-startup-option';
import { BreakSessionStartupOption } from '../../core/models/time-session/break-session-startup-option';
import { WorkItemStatus } from '../../core/enums/work-item-status.enum';
import { TimeSessionHttpService } from '../../core/services/http/time-session-http/time-session-http.service';

import { IState } from './time-session.state';
import { GettersAugments, GetterKey } from './time-session.getters';
import { IMutations, MutationKey } from './time-session.mutations';

let timeSessionHttpService: TimeSessionHttpService;

export enum ActionKey {
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

interface ActionAugments extends Omit<ActionContext<IState, IState>, 'getters' | 'commit'> {
    getters: GettersAugments;
    commit<T extends keyof IMutations>(key: T, payload: Parameters<IMutations[T]>[1]): ReturnType<IMutations[T]>;
}

export interface IActions {
    [ActionKey.StartFocusSession](context: ActionAugments, payload: FocusSessionStartupOption): Promise<boolean>;
    [ActionKey.StopFocusSession](context: ActionAugments, id: string): Promise<boolean>;
    [ActionKey.StartOverlearning](context: ActionAugments, targetStatus: WorkItemStatus): Promise<boolean>;
    [ActionKey.SwitchWorkItem](context: ActionAugments, id: string): Promise<boolean>;
    [ActionKey.StartBreakSession](context: ActionAugments, payload: BreakSessionStartupOption): Promise<boolean>;
    [ActionKey.StopBreakSession](context: ActionAugments, id: string): Promise<boolean>;
    [ActionKey.LoadActiveTimeSession](context: ActionAugments): Promise<void>;
    [ActionKey.LoadStaleTimeSession](context: ActionAugments): Promise<void>;
    [ActionKey.SyncActiveTimeSession](context: ActionAugments): Promise<void>;
}

export const setActionServices = (timeSessionHttp: TimeSessionHttpService): void => {
    timeSessionHttpService = timeSessionHttp;
}

export const actions: ActionTree<IState, IState> & IActions = {
    async [ActionKey.StartFocusSession](context: ActionAugments, payload: FocusSessionStartupOption): Promise<boolean> {
        const isStarted = await timeSessionHttpService.startFocusSession(payload);

        if (isStarted) {
            await context.dispatch(ActionKey.LoadActiveTimeSession);
        }

        return isStarted;
    },
    async [ActionKey.StopFocusSession](context: ActionAugments, id: string): Promise<boolean> {
        const isStopped = await timeSessionHttpService.stopFocusSession(id);

        if (isStopped) {
            await context.dispatch(ActionKey.LoadActiveTimeSession);
            await context.dispatch(ActionKey.LoadStaleTimeSession);
        }

        return isStopped;
    },
    async [ActionKey.StartOverlearning](context: ActionAugments, targetStatus: WorkItemStatus): Promise<boolean> {
        const isStarted = await timeSessionHttpService.startOverlearning(targetStatus);

        if (isStarted) {
            context.dispatch(`workItem/${WorkItemActionKey.ReloadWorkItems}`, null, { root: true });
            context.dispatch(ActionKey.LoadActiveTimeSession);
        }

        return isStarted;
    },
    async [ActionKey.SwitchWorkItem](context: ActionAugments, id: string): Promise<boolean> {
        const isSwitched = await timeSessionHttpService.switchWorkItem(id);

        if (isSwitched) {
            context.dispatch(`workItem/${WorkItemActionKey.ReloadWorkItems}`, null, { root: true });
            context.dispatch(ActionKey.LoadActiveTimeSession);
        }

        return isSwitched;
    },
    async [ActionKey.StartBreakSession](context: ActionAugments, payload: BreakSessionStartupOption): Promise<boolean> {
        if (!payload.totalMinutes) {
            return true;
        }

        const isStarted = await timeSessionHttpService.startBreakSession(payload);

        if (isStarted) {
            await context.dispatch(ActionKey.LoadActiveTimeSession);
        }

        return isStarted;
    },
    async [ActionKey.StopBreakSession](context: ActionAugments, id: string): Promise<boolean> {
        const isStopped = await timeSessionHttpService.stopBreakSession(id);

        if (isStopped) {
            await context.dispatch(ActionKey.LoadActiveTimeSession);
            await context.dispatch(ActionKey.LoadStaleTimeSession);
        }

        return isStopped;
    },
    async [ActionKey.LoadActiveTimeSession](context: ActionAugments): Promise<void> {
        context.commit(MutationKey.SetActiveFocusSession, await timeSessionHttpService.getActiveFocusSessionMeta());
        context.commit(MutationKey.SetActiveBreakSession, await timeSessionHttpService.getActiveBreakSession());
    },
    async [ActionKey.LoadStaleTimeSession](context: ActionAugments): Promise<void> {
        context.commit(MutationKey.SetStaleFocusSession, await timeSessionHttpService.getStaleFocusSessionMeta());
        context.commit(MutationKey.SetStaleBreakSession, await timeSessionHttpService.getStaleBreakSession());
    },
    async [ActionKey.SyncActiveTimeSession](context: ActionAugments): Promise<void> {
        const { getters, commit, dispatch } = context;
        const focusSession = getters[GetterKey.ActiveFocusSession];
        const breakSession = getters[GetterKey.ActiveBreakSession];
        const hasSession = focusSession || breakSession;

        if (hasSession && !getters[GetterKey.HasOngoingTimeSession]) {
            await dispatch(ActionKey.LoadStaleTimeSession);
            await dispatch(ActionKey.LoadActiveTimeSession);
        }
        else if (focusSession) {
            commit(MutationKey.SetActiveFocusSession, { ...focusSession });
        }
        else if (breakSession) {
            commit(MutationKey.SetActiveBreakSession, { ...breakSession });
        }

        setTimeout(() => actions[ActionKey.SyncActiveTimeSession](context), 1000);
    }
};
