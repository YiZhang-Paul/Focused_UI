export class BlockGroup {
    public total: number;
    public backgroundColor: string;
    public shadowColor: string;

    constructor(total: number, backgroundColor: string, shadowColor: string) {
        this.total = total;
        this.backgroundColor = backgroundColor;
        this.shadowColor = shadowColor;
    }
}
