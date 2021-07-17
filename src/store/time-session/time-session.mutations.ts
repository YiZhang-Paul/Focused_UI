import { MutationTree } from 'vuex';

import { FocusSessionDto } from '../../core/dtos/focus-session-dto';
import { BreakSession } from '../../core/models/time-session/break-session';

import { IState } from './time-session.state';

export enum MutationKey {
    SetActiveFocusSession = 'set_active_focus_session',
    SetStaleFocusSession = 'set_stale_focus_session',
    SetActiveBreakSession = 'set_active_break_session',
    SetStaleBreakSession = 'set_stale_break_session'
}

export interface IMutations {
    [MutationKey.SetActiveFocusSession](state: IState, session: FocusSessionDto | null): void;
    [MutationKey.SetStaleFocusSession](state: IState, session: FocusSessionDto | null): void;
    [MutationKey.SetActiveBreakSession](state: IState, session: BreakSession | null): void;
    [MutationKey.SetStaleBreakSession](state: IState, session: BreakSession | null): void;
}

export const mutations: MutationTree<IState> & IMutations = {
    [MutationKey.SetActiveFocusSession](state: IState, session: FocusSessionDto | null): void {
        state.activeFocusSession = session;
    },
    [MutationKey.SetStaleFocusSession](state: IState, session: FocusSessionDto | null): void {
        state.staleFocusSession = session;
    },
    [MutationKey.SetActiveBreakSession](state: IState, session: BreakSession | null): void {
        state.activeBreakSession = session;
    },
    [MutationKey.SetStaleBreakSession](state: IState, session: BreakSession | null): void {
        state.staleBreakSession = session;
    }
};
