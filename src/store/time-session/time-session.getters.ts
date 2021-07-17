import { GetterTree } from 'vuex';

import { FocusSessionDto } from '../../core/dtos/focus-session-dto';
import { BreakSession } from '../../core/models/time-session/break-session';
import { WorkItemStatus } from '../../core/enums/work-item-status.enum';
import { TimeSessionStatus } from '../../core/enums/time-session-status.enum';

import { IState } from './time-session.state';

const oneHour = 1000 * 60 * 60;

export enum GetterKey {
    TimeSessionStatus = 'time_session_status',
    HasActiveFocusSession = 'has_active_focus_session',
    HasOngoingTimeSession = 'has_ongoing_time_session',
    OngoingTimeSessionEnd = 'ongoing_time_session_end',
    ActiveFocusSession = 'active_focus_session',
    StaleFocusSession = 'stale_focus_session',
    ActiveBreakSession = 'active_break_session',
    StaleBreakSession = 'stale_break_session'
}

export type GettersAugments = {
    [key in GetterKey]: ReturnType<IGetters[key]>;
}

export interface IGetters {
    [GetterKey.TimeSessionStatus](state: IState): TimeSessionStatus;
    [GetterKey.HasActiveFocusSession](state: IState): boolean;
    [GetterKey.HasOngoingTimeSession](state: IState, getters: GettersAugments): boolean;
    [GetterKey.OngoingTimeSessionEnd](state: IState, getters: GettersAugments): Date | null;
    [GetterKey.ActiveFocusSession](state: IState): FocusSessionDto | null;
    [GetterKey.StaleFocusSession](state: IState): FocusSessionDto | null;
    [GetterKey.ActiveBreakSession](state: IState): BreakSession | null;
    [GetterKey.StaleBreakSession](state: IState): BreakSession | null;
}

export const getters: GetterTree<IState, IState> & IGetters = {
    [GetterKey.TimeSessionStatus]: (state: IState): TimeSessionStatus => {
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
    [GetterKey.HasActiveFocusSession]: (state: IState): boolean => Boolean(state.activeFocusSession),
    [GetterKey.HasOngoingTimeSession]: (_: IState, getters: GettersAugments): boolean => {
        const timestamp = getters[GetterKey.OngoingTimeSessionEnd]?.getTime() ?? 0;

        return timestamp >= Date.now();
    },
    [GetterKey.OngoingTimeSessionEnd]: (state: IState, getters: GettersAugments): Date | null => {
        const { activeBreakSession, activeFocusSession } = state;
        const status = getters[GetterKey.TimeSessionStatus];

        if (status === TimeSessionStatus.Idle) {
            return null;
        }

        const isResting = status === TimeSessionStatus.Resting;
        const start = isResting ? activeBreakSession!.startTime : activeFocusSession!.startTime;
        const duration = isResting ? activeBreakSession!.targetDuration : activeFocusSession!.targetDuration;

        return new Date(new Date(start).getTime() + duration * oneHour);
    },
    [GetterKey.ActiveFocusSession]: (state: IState): FocusSessionDto | null => state.activeFocusSession,
    [GetterKey.StaleFocusSession]: (state: IState): FocusSessionDto | null => state.staleFocusSession,
    [GetterKey.ActiveBreakSession]: (state: IState): BreakSession | null => state.activeBreakSession,
    [GetterKey.StaleBreakSession]: (state: IState): BreakSession | null => state.staleBreakSession
};
