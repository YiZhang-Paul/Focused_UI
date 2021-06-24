export class BreakSession {
    public id!: string;
    public userId!: string;
    public startTime = '';
    public endTime? = '';
    public focusSessionId = '';
    public targetDuration = 0;
    public isLongBreak = false;
}
