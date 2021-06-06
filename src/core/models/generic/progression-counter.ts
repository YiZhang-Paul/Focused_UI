export class ProgressionCounter<T> {
    public current!: T;
    public target!: T;
    public isCompleted = false;
}
