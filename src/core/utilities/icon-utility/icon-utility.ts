import { markRaw } from 'vue';
import { Flash, Repeat, Selection } from 'mdue';

import { IconMeta } from '../../models/generic/icon-meta';
import { WorkItemType } from '../../enums/work-item-type.enum';

export class IconUtility {

    public static getWorkItemIcon(type: WorkItemType): IconMeta {
        if (type === WorkItemType.Interruption) {
            return {
                content: markRaw(Flash),
                color: 'var(--work-item-type-colors-interruption)'
            };
        }

        if (type === WorkItemType.Recurring) {
            return {
                content: markRaw(Repeat),
                color: 'var(--work-item-type-colors-recurring)'
            };
        }

        return {
            content: markRaw(Selection),
            color: 'var(--work-item-type-colors-regular)'
        };
    }
}
