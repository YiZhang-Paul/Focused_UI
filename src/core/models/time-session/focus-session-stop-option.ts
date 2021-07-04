export class FocusSessionStopOption {
    public focusSessionId: string;
    public breakSessionDuration: number;

    constructor(focusSessionId: string, breakSessionDuration: number) {
        this.focusSessionId = focusSessionId;
        this.breakSessionDuration = breakSessionDuration;
    }
}
