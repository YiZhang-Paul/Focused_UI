export class FocusSessionStartupOption {
    public workItemId: string;
    public totalMinutes: number;

    constructor(workItemId: string, totalMinutes: number) {
        this.workItemId = workItemId;
        this.totalMinutes = totalMinutes;
    }
}
