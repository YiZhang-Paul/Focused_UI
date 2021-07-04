export class BreakSessionStopOption {
    public breakSessionId: string;
    public isReloadRequired: boolean;

    constructor(breakSessionId: string, isReloadRequired = true) {
        this.breakSessionId = breakSessionId;
        this.isReloadRequired = isReloadRequired;
    }
}
