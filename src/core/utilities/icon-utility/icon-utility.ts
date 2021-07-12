import { markRaw } from 'vue';

import {
    CalendarCheck,
    Check,
    ClockTimeThree,
    Close,
    Flash,
    HeadAlert,
    LightbulbOn,
    PalmTree,
    ProgressQuestion,
    RecordCircleOutline,
    Repeat,
    Selection,
    Shield,
    Tag,
    WeatherNight,
    WeatherSunset,
    WhiteBalanceSunny,
    Yoga
} from 'mdue';

import { IconMeta } from '../../models/generic/icon-meta';
import { GenericFilterType } from '../../enums/generic-filter-type.enum';
import { UserRating } from '../../enums/user-rating.enum';
import { TimeSessionStatus } from '../../enums/time-session-status.enum';
import { WorkItemType } from '../../enums/work-item-type.enum';

export class IconUtility {
    /* istanbul ignore next */
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
    /* istanbul ignore next */
    public static getTimeSessionIcon(status: TimeSessionStatus): IconMeta {
        if (status === TimeSessionStatus.Idle) {
            return {
                content: markRaw(ProgressQuestion),
                color: 'var(--session-status-colors-idle-03)'
            };
        }

        if (status === TimeSessionStatus.Ongoing) {
            return {
                content: markRaw(LightbulbOn),
                color: 'var(--session-status-colors-ongoing-icon)'
            };
        }

        if (status === TimeSessionStatus.Pending) {
            return {
                content: markRaw(Tag),
                color: 'var(--session-status-colors-pending-00)'
            };
        }

        return {
            content: markRaw(PalmTree),
            color: 'var(--session-status-colors-resting-00)'
        };
    }
    /* istanbul ignore next */
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
    /* istanbul ignore next */
    public static getUserRatingIcon(rating: UserRating): IconMeta {
        const color = 'var(--primary-colors-0-00)';

        if (rating === UserRating.Determination) {
            return {
                name: 'determination',
                content: markRaw(HeadAlert),
                color
            };
        }

        if (rating === UserRating.Estimation) {
            return {
                name: 'estimation',
                content: markRaw(ClockTimeThree),
                color
            };
        }

        if (rating === UserRating.Planning) {
            return {
                name: 'planning',
                content: markRaw(CalendarCheck),
                color
            };
        }

        if (rating === UserRating.Adaptability) {
            return {
                name: 'adaptability',
                content: markRaw(Yoga),
                color
            };
        }

        return {
            name: 'sustainability',
            content: markRaw(Shield),
            color
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
