import { IconMeta } from './icon-meta';

export class ControlButtonOption {
    public icon: IconMeta;
    public isActive: boolean;

    constructor(icon: IconMeta, isActive = false) {
        this.icon = icon;
        this.isActive = isActive;
    }
}
