import { markRaw } from 'vue';
import { Check, Close, Flash, RecordCircleOutline, Repeat, Selection, WeatherNight, WeatherSunset, WhiteBalanceSunny } from 'mdue';

import { IconMeta } from '../../models/generic/icon-meta';
import { GenericFilterType } from '../../enums/generic-filter-type.enum';
import { WorkItemType } from '../../enums/work-item-type.enum';

export class IconUtility {

    public static getGenericFilterIcon(type: GenericFilterType): IconMeta {
        if (type === GenericFilterType.All) {
            return {
                name: 'all',
                content: markRaw(RecordCircleOutline),
                color: 'rgb(120, 255, 255)'
            };
        }

        const isYes = type === GenericFilterType.Yes;

        return {
            name: isYes ? 'yes' : 'no',
            content: isYes ? markRaw(Check) : markRaw(Close),
            color: isYes ? 'rgb(15, 255, 39)' : 'rgb(255, 0, 0)'
        };
    }

    public static getWorkItemIcon(type: WorkItemType): IconMeta {
        if (type === WorkItemType.Interruption) {
            return {
                name: 'interruption',
                content: markRaw(Flash),
                color: 'var(--activity-colors-interruption-00)'
            };
        }

        if (type === WorkItemType.Recurring) {
            return {
                name: 'recurring',
                content: markRaw(Repeat),
                color: 'var(--activity-colors-recurring-00)'
            };
        }

        return {
            name: 'regular',
            content: markRaw(Selection),
            color: 'var(--activity-colors-regular-00)'
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
