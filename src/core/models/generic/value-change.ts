export class ValueChange<T> {
    public previous: T;
    public current: T;

    constructor(previous: T, current: T) {
        this.previous = previous;
        this.current = current;
    }
}
