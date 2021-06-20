export class FocusSession {
    public id!: string;
    public userId!: string;
    public startTime = '';
    public endTime = '';
    public overlearningHours = 0;
    public workItemIds: string[] = [];
}
