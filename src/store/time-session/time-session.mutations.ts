import { MutationTree } from 'vuex';

import { FocusSessionDto } from '../../core/dtos/focus-session-dto';
import { BreakSession } from '../../core/models/time-session/break-session';

import { ITimeSessionState } from './time-session.state';

export enum TimeSessionMutation {
    SetActiveFocusSession = 'set_active_focus_session',
    SetStaleFocusSession = 'set_stale_focus_session',
    SetActiveBreakSession = 'set_active_break_session',
    SetStaleBreakSession = 'set_stale_break_session'
}

export interface ITimeSessionMutations {
    [TimeSessionMutation.SetActiveFocusSession](state: ITimeSessionState, session: FocusSessionDto | null): void;
    [TimeSessionMutation.SetStaleFocusSession](state: ITimeSessionState, session: FocusSessionDto | null): void;
    [TimeSessionMutation.SetActiveBreakSession](state: ITimeSessionState, session: BreakSession | null): void;
    [TimeSessionMutation.SetStaleBreakSession](state: ITimeSessionState, session: BreakSession | null): void;
}

export const mutations: MutationTree<ITimeSessionState> & ITimeSessionMutations = {
    [TimeSessionMutation.SetActiveFocusSession](state: ITimeSessionState, session: FocusSessionDto | null): void {
        state.activeFocusSession = session;
    },
    [TimeSessionMutation.SetStaleFocusSession](state: ITimeSessionState, session: FocusSessionDto | null): void {
        state.staleFocusSession = session;
    },
    [TimeSessionMutation.SetActiveBreakSession](state: ITimeSessionState, session: BreakSession | null): void {
        state.activeBreakSession = session;
    },
    [TimeSessionMutation.SetStaleBreakSession](state: ITimeSessionState, session: BreakSession | null): void {
        state.staleBreakSession = session;
    }
};
