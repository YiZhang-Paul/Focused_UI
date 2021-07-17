import { FocusSessionDto } from '../../core/dtos/focus-session-dto';
import { BreakSession } from '../../core/models/time-session/break-session';

export interface IState {
    activeFocusSession: FocusSessionDto | null;
    staleFocusSession: FocusSessionDto | null;
    activeBreakSession: BreakSession | null;
    staleBreakSession: BreakSession | null;
}

export const state = (): IState => ({
    activeFocusSession: null,
    staleFocusSession: null,
    activeBreakSession: null,
    staleBreakSession: null
});
