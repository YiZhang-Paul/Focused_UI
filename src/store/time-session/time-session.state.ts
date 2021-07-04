import { ActionContext } from 'vuex';

import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { FocusSessionDto } from '../../core/dtos/focus-session-dto';
import { BreakSession } from '../../core/models/time-session/break-session';
import { FocusSessionStartupOption } from '../../core/models/time-session/focus-session-startup-option';
import { FocusSessionStopOption } from '../../core/models/time-session/focus-session-stop-option';
import { BreakSessionStartupOption } from '../../core/models/time-session/break-session-startup-option';
import { WorkItemType } from '../../core/enums/work-item-type.enum';
import { WorkItemStatus } from '../../core/enums/work-item-status.enum';
import { TimeSessionStatus } from '../../core/enums/time-session-status.enum';
import { TimeSessionHttpService } from '../../core/services/http/time-session-http/time-session-http.service';

const oneSecond = 1000;
const oneHour = oneSecond * 60 * 60;
let timeSessionHttpService: TimeSessionHttpService;

export interface ITimeSessionState {
    activeFocusSession: FocusSessionDto | null;
    activeBreakSession: BreakSession | null;
}

const state = (): ITimeSessionState => ({
    activeFocusSession: null,
    activeBreakSession: null
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
    activeBreakSession: (state: ITimeSessionState): BreakSession | null => state.activeBreakSession
};

const mutations = {
    setActiveFocusSession(state: ITimeSessionState, session: FocusSessionDto | null): void {
        state.activeFocusSession = session;
    },
    setActiveBreakSession(state: ITimeSessionState, session: BreakSession | null): void {
        state.activeBreakSession = session;
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
    async stopFocusSession(context: ActionContext<ITimeSessionState, any>, payload: FocusSessionStopOption): Promise<boolean> {
        const isStopped = await timeSessionHttpService.stopFocusSession(payload.focusSessionId);

        if (isStopped && payload.isReloadRequired) {
            await context.dispatch('loadActiveTimeSession');
        }

        return isStopped;
    },
    async startBreakSession(context: ActionContext<ITimeSessionState, any>, payload: BreakSessionStartupOption): Promise<boolean> {
        const isStarted = await timeSessionHttpService.startBreakSession(payload);

        if (isStarted) {
            await context.dispatch('loadActiveTimeSession');
        }

        return isStarted;
    },
    async loadActiveTimeSession(context: ActionContext<ITimeSessionState, any>): Promise<void> {
        context.commit('setActiveFocusSession', await timeSessionHttpService.getActiveFocusSessionMeta());
        context.commit('setActiveBreakSession', await timeSessionHttpService.getActiveBreakSession());
    },
    syncActiveTimeSession(context: ActionContext<ITimeSessionState, any>): void {
        const { getters, commit } = context;
        const focusSession = getters['activeFocusSession'] as FocusSessionDto;
        const breakSession = getters['activeBreakSession'] as BreakSession;

        if (focusSession) {
            const delta = oneSecond / oneHour;
            const { workItems, activities } = focusSession;
            const ongoing = workItems.find(_ => _.status === WorkItemStatus.Ongoing);
            activities.regular += ongoing?.type === WorkItemType.Regular ? delta : 0;
            activities.recurring += ongoing?.type === WorkItemType.Recurring ? delta : 0;
            activities.interruption += ongoing?.type === WorkItemType.Interruption ? delta : 0;
            activities.overlearning += ongoing ? 0 : delta;
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
