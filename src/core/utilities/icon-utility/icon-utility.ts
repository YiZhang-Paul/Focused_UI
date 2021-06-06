import { markRaw } from 'vue';
import { Check, Close, Flash, Repeat, Selection, WeatherNight, WeatherSunset, WhiteBalanceSunny } from 'mdue';

import { IconMeta } from '../../models/generic/icon-meta';
import { WorkItemType } from '../../enums/work-item-type.enum';

export class IconUtility {

    public static getCompletionFilterIcon(isCompleted: boolean): IconMeta {
        return {
            name: isCompleted ? 'completed' : 'incomplete',
            content: isCompleted ? markRaw(Check) : markRaw(Close),
            color: isCompleted ? 'rgb(15, 255, 39)' : 'rgb(255, 0, 0)'
        };
    }

    public static getWorkItemIcon(type: WorkItemType): IconMeta {
        if (type === WorkItemType.Interruption) {
            return {
                name: 'interruption',
                content: markRaw(Flash),
                color: 'var(--work-item-type-colors-interruption)'
            };
        }

        if (type === WorkItemType.Recurring) {
            return {
                name: 'recurring',
                content: markRaw(Repeat),
                color: 'var(--work-item-type-colors-recurring)'
            };
        }

        return {
            name: 'regular',
            content: markRaw(Selection),
            color: 'var(--work-item-type-colors-regular)'
        };
    }

    public static getTimeIcon(time: Date): IconMeta {
        const hour = time.getHours();

        if (hour >= 7 && hour < 17) {
            return {
                name: 'day',
                content: markRaw(WhiteBalanceSunny),
                color: 'rgb(255, 226, 72)'
            };
        }

        if (hour >= 17 && hour < 20) {
            return {
                name: 'sunset',
                content: markRaw(WeatherSunset),
                color: 'rgb(248, 136, 44)'
            };
        }

        return {
            name: 'night',
            content: markRaw(WeatherNight),
            color: 'rgb(255, 239, 183)'
        };
    }
}
