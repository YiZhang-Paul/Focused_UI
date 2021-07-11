import { ActionContext } from 'vuex';

import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { workItemKey } from '../work-item/work-item.state';
import { FocusSessionDto } from '../../core/dtos/focus-session-dto';
import { BreakSession } from '../../core/models/time-session/break-session';
import { FocusSessionStartupOption } from '../../core/models/time-session/focus-session-startup-option';
import { BreakSessionStartupOption } from '../../core/models/time-session/break-session-startup-option';
import { WorkItemStatus } from '../../core/enums/work-item-status.enum';
import { TimeSessionStatus } from '../../core/enums/time-session-status.enum';
import { TimeSessionHttpService } from '../../core/services/http/time-session-http/time-session-http.service';

const oneSecond = 1000;
const oneHour = oneSecond * 60 * 60;
let timeSessionHttpService: TimeSessionHttpService;

export interface ITimeSessionState {
    activeFocusSession: FocusSessionDto | null;
    staleFocusSession: FocusSessionDto | null;
    activeBreakSession: BreakSession | null;
    staleBreakSession: BreakSession | null;
}

const state = (): ITimeSessionState => ({
    activeFocusSession: null,
    staleFocusSession: null,
    activeBreakSession: null,
    staleBreakSession: null
});

const getters = {
    timeSessionStatus: (state: ITimeSessionState): TimeSessionStatus => {
        const { activeFocusSession, activeBreakSession } = state;

        if (activeBreakSession) {
            return TimeSessionStatus.Resting;
        }

        if (!activeFocusSession) {
            return TimeSessionStatus.Idle;
        }

        const isOngoing = activeFocusSession.workItems.some(_ => _.status === WorkItemStatus.Ongoing);

        return isOngoing ? TimeSessionStatus.Ongoing : TimeSessionStatus.Pending;
    },
    hasActiveFocusSession: (state: ITimeSessionState): boolean => Boolean(state.activeFocusSession),
    hasOngoingTimeSession: (_: ITimeSessionState, getters: any): boolean => {
        const timestamp = getters['ongoingTimeSessionEnd']?.getTime() ?? 0;

        return timestamp >= Date.now();
    },
    ongoingTimeSessionEnd: (state: ITimeSessionState, getters: any): Date | null => {
        const { activeBreakSession, activeFocusSession } = state;
        const status = getters['timeSessionStatus'];

        if (status === TimeSessionStatus.Idle) {
            return null;
        }

        const isResting = status === TimeSessionStatus.Resting;
        const start = isResting ? activeBreakSession!.startTime : activeFocusSession!.startTime;
        const duration = isResting ? activeBreakSession!.targetDuration : activeFocusSession!.targetDuration;

        return new Date(new Date(start).getTime() + duration * oneHour);
    },
    activeFocusSession: (state: ITimeSessionState): FocusSessionDto | null => state.activeFocusSession,
    staleFocusSession: (state: ITimeSessionState): FocusSessionDto | null => state.staleFocusSession,
    activeBreakSession: (state: ITimeSessionState): BreakSession | null => state.activeBreakSession,
    staleBreakSession: (state: ITimeSessionState): BreakSession | null => state.staleBreakSession
};

const mutations = {
    setActiveFocusSession(state: ITimeSessionState, session: FocusSessionDto | null): void {
        state.activeFocusSession = session;
    },
    setStaleFocusSession(state: ITimeSessionState, session: FocusSessionDto | null): void {
        state.staleFocusSession = session;
    },
    setActiveBreakSession(state: ITimeSessionState, session: BreakSession | null): void {
        state.activeBreakSession = session;
    },
    setStaleBreakSession(state: ITimeSessionState, session: BreakSession | null): void {
        state.staleBreakSession = session;
    }
};

const actions = {
    async startFocusSession(context: ActionContext<ITimeSessionState, any>, payload: FocusSessionStartupOption): Promise<boolean> {
        const isStarted = await timeSessionHttpService.startFocusSession(payload);

        if (isStarted) {
            await context.dispatch('loadActiveTimeSession');
        }

        return isStarted;
    },
    async stopFocusSession(context: ActionContext<ITimeSessionState, any>, id: string): Promise<boolean> {
        const isStopped = await timeSessionHttpService.stopFocusSession(id);

        if (isStopped) {
            await context.dispatch('loadActiveTimeSession');
            await context.dispatch('loadStaleTimeSession');
        }

        return isStopped;
    },
    async startOverlearning(context: ActionContext<ITimeSessionState, any>, targetStatus: WorkItemStatus): Promise<boolean> {
        const isStarted = await timeSessionHttpService.startOverlearning(targetStatus);

        if (isStarted) {
            context.dispatch(`${workItemKey}/reloadWorkItems`, null, { root: true });
            context.dispatch('loadActiveTimeSession');
        }

        return isStarted;
    },
    async switchWorkItem(context: ActionContext<ITimeSessionState, any>, id: string): Promise<boolean> {
        const isSwitched = await timeSessionHttpService.switchWorkItem(id);

        if (isSwitched) {
            context.dispatch(`${workItemKey}/reloadWorkItems`, null, { root: true });
            context.dispatch('loadActiveTimeSession');
        }

        return isSwitched;
    },
    async startBreakSession(context: ActionContext<ITimeSessionState, any>, payload: BreakSessionStartupOption): Promise<boolean> {
        if (!payload.totalMinutes) {
            return true;
        }

        const isStarted = await timeSessionHttpService.startBreakSession(payload);

        if (isStarted) {
            await context.dispatch('loadActiveTimeSession');
        }

        return isStarted;
    },
    async stopBreakSession(context: ActionContext<ITimeSessionState, any>, id: string): Promise<boolean> {
        const isStopped = await timeSessionHttpService.stopBreakSession(id);

        if (isStopped) {
            await context.dispatch('loadActiveTimeSession');
            await context.dispatch('loadStaleTimeSession');
        }

        return isStopped;
    },
    async loadActiveTimeSession(context: ActionContext<ITimeSessionState, any>): Promise<void> {
        context.commit('setActiveFocusSession', await timeSessionHttpService.getActiveFocusSessionMeta());
        context.commit('setActiveBreakSession', await timeSessionHttpService.getActiveBreakSession());
    },
    async loadStaleTimeSession(context: ActionContext<ITimeSessionState, any>): Promise<void> {
        context.commit('setStaleFocusSession', await timeSessionHttpService.getStaleFocusSessionMeta());
        context.commit('setStaleBreakSession', await timeSessionHttpService.getStaleBreakSession());
    },
    async syncActiveTimeSession(context: ActionContext<ITimeSessionState, any>): Promise<void> {
        const { getters, commit, dispatch } = context;
        const focusSession = getters['activeFocusSession'] as FocusSessionDto;
        const breakSession = getters['activeBreakSession'] as BreakSession;
        const hasSession = focusSession || breakSession;

        if (hasSession && !getters['hasOngoingTimeSession']) {
            await dispatch('loadStaleTimeSession');
            await dispatch('loadActiveTimeSession');
        }
        else if (focusSession) {
            commit('setActiveFocusSession', { ...focusSession });
        }
        else if (breakSession) {
            commit('setActiveBreakSession', { ...breakSession });
        }

        setTimeout(() => actions.syncActiveTimeSession(context), oneSecond);
    }
};

export const timeSessionKey = 'timeSession';

export const createStore = () => {
    timeSessionHttpService = container.get<TimeSessionHttpService>(types.TimeSessionHttpService);

    return {
        namespaced: true,
        state,
        getters,
        mutations,
        actions
    };
};

export const timeSession = createStore();
