import { markRaw } from 'vue';
import { Flash, Repeat, Selection, WeatherNight, WeatherSunset, WhiteBalanceSunny } from 'mdue';

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

    public static getTimeIcon(time: Date): IconMeta {
        const hour = time.getHours();

        if (hour >= 8 && hour < 17) {
            return {
                content: markRaw(WhiteBalanceSunny),
                color: 'rgb(255, 226, 72)'
            };
        }

        if (hour >= 17 && hour < 20) {
            return {
                content: markRaw(WeatherSunset),
                color: 'rgb(248, 136, 44)'
            };
        }

        return {
            content: markRaw(WeatherNight),
            color: 'rgb(255, 239, 183)'
        };
    }
}
