import { TimeEvent } from './time-event';

export class TimeSeries {
    public manualTracking = 0;
    public autoTracking: TimeEvent[] = [];
}
