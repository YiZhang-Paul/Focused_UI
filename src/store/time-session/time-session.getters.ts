import { GetterTree } from 'vuex';

import { FocusSessionDto } from '../../core/dtos/focus-session-dto';
import { BreakSession } from '../../core/models/time-session/break-session';
import { WorkItemStatus } from '../../core/enums/work-item-status.enum';
import { TimeSessionStatus } from '../../core/enums/time-session-status.enum';

import { ITimeSessionState } from './time-session.state';

const oneHour = 1000 * 60 * 60;

export enum TimeSessionGetter {
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
    [key in TimeSessionGetter]: ReturnType<ITimeSessionGetters[key]>;
}

export interface ITimeSessionGetters {
    [TimeSessionGetter.TimeSessionStatus](state: ITimeSessionState): TimeSessionStatus;
    [TimeSessionGetter.HasActiveFocusSession](state: ITimeSessionState): boolean;
    [TimeSessionGetter.HasOngoingTimeSession](state: ITimeSessionState, getters: GettersAugments): boolean;
    [TimeSessionGetter.OngoingTimeSessionEnd](state: ITimeSessionState, getters: GettersAugments): Date | null;
    [TimeSessionGetter.ActiveFocusSession](state: ITimeSessionState): FocusSessionDto | null;
    [TimeSessionGetter.StaleFocusSession](state: ITimeSessionState): FocusSessionDto | null;
    [TimeSessionGetter.ActiveBreakSession](state: ITimeSessionState): BreakSession | null;
    [TimeSessionGetter.StaleBreakSession](state: ITimeSessionState): BreakSession | null;
}

export const getters: GetterTree<ITimeSessionState, ITimeSessionState> & ITimeSessionGetters = {
    [TimeSessionGetter.TimeSessionStatus]: (state: ITimeSessionState): TimeSessionStatus => {
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
    [TimeSessionGetter.HasActiveFocusSession]: (state: ITimeSessionState): boolean => Boolean(state.activeFocusSession),
    [TimeSessionGetter.HasOngoingTimeSession]: (_: ITimeSessionState, getters: GettersAugments): boolean => {
        const timestamp = getters[TimeSessionGetter.OngoingTimeSessionEnd]?.getTime() ?? 0;

        return timestamp >= Date.now();
    },
    [TimeSessionGetter.OngoingTimeSessionEnd]: (state: ITimeSessionState, getters: GettersAugments): Date | null => {
        const { activeBreakSession, activeFocusSession } = state;
        const status = getters[TimeSessionGetter.TimeSessionStatus];

        if (status === TimeSessionStatus.Idle) {
            return null;
        }

        const isResting = status === TimeSessionStatus.Resting;
        const start = isResting ? activeBreakSession!.startTime : activeFocusSession!.startTime;
        const duration = isResting ? activeBreakSession!.targetDuration : activeFocusSession!.targetDuration;

        return new Date(new Date(start).getTime() + duration * oneHour);
    },
    [TimeSessionGetter.ActiveFocusSession]: (state: ITimeSessionState): FocusSessionDto | null => state.activeFocusSession,
    [TimeSessionGetter.StaleFocusSession]: (state: ITimeSessionState): FocusSessionDto | null => state.staleFocusSession,
    [TimeSessionGetter.ActiveBreakSession]: (state: ITimeSessionState): BreakSession | null => state.activeBreakSession,
    [TimeSessionGetter.StaleBreakSession]: (state: ITimeSessionState): BreakSession | null => state.staleBreakSession
};
