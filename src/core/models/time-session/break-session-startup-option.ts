export class BreakSessionStartupOption {
    public focusSessionId: string;
    public totalMinutes: number;

    constructor(focusSessionId: string, totalMinutes: number) {
        this.focusSessionId = focusSessionId;
        this.totalMinutes = totalMinutes;
    }
}
