export class FocusSessionStopOption {
    public focusSessionId: string;
    public breakSessionDuration: number;
    public isReloadRequired: boolean;

    constructor(focusSessionId: string, breakSessionDuration: number, isReloadRequired = true) {
        this.focusSessionId = focusSessionId;
        this.breakSessionDuration = breakSessionDuration;
        this.isReloadRequired = isReloadRequired;
    }
}
