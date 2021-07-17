import { FocusSessionDto } from '../../core/dtos/focus-session-dto';
import { BreakSession } from '../../core/models/time-session/break-session';

export interface ITimeSessionState {
    activeFocusSession: FocusSessionDto | null;
    staleFocusSession: FocusSessionDto | null;
    activeBreakSession: BreakSession | null;
    staleBreakSession: BreakSession | null;
}

export const state = (): ITimeSessionState => ({
    activeFocusSession: null,
    staleFocusSession: null,
    activeBreakSession: null,
    staleBreakSession: null
});
