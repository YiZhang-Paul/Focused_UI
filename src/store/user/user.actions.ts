import { ActionContext, ActionTree } from 'vuex';

import { UserProfile } from '../../core/models/user/user-profile';
import { PerformanceRating } from '../../core/models/user/performance-rating';
import { UserProfileHttpService } from '../../core/services/http/user-profile-http/user-profile-http.service';

import { IState } from './user.state';
import { Mutations, MutationKey } from './user.mutations';

let userProfileHttpService: UserProfileHttpService;
const userId = '60cd1862629e063c384f3ea1';

export enum ActionKey {
    LoadProfile = 'load_profile',
    UpdateUserRatings = 'update_user_ratings'
}

interface ActionAugments extends Omit<ActionContext<IState, IState>, 'commit'> {
    commit<T extends keyof Mutations>(key: T, payload: Parameters<Mutations[T]>[1]): ReturnType<Mutations[T]>;
}

export type Actions = {
    [ActionKey.LoadProfile](context: ActionAugments): Promise<void>;
    [ActionKey.UpdateUserRatings](context: ActionAugments, payload: PerformanceRating): Promise<boolean>;
}

export const setActionServices = (userProfileHttp: UserProfileHttpService): void => {
    userProfileHttpService = userProfileHttp;
}

export const actions: ActionTree<IState, IState> & Actions = {
    async [ActionKey.LoadProfile](context: ActionAugments): Promise<void> {
        const user = await userProfileHttpService.getUserProfile(userId);
        context.commit(MutationKey.SetProfile, user);
    },
    async [ActionKey.UpdateUserRatings](context: ActionAugments, payload: PerformanceRating): Promise<boolean> {
        const ratings = await userProfileHttpService.updateUserRatings(userId, payload);

        if (ratings) {
            const user: UserProfile = { ...context.state.profile!, ratings };
            context.commit(MutationKey.SetProfile, user);
        }

        return Boolean(ratings);
    }
};
