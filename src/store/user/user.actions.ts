import { ActionContext, ActionTree } from 'vuex';

import { UserProfile } from '../../core/models/user/user-profile';
import { PerformanceRating } from '../../core/models/user/performance-rating';
import { UserProfileHttpService } from '../../core/services/http/user-profile-http/user-profile-http.service';

import { IUserState } from './user.state';
import { IUserMutations, UserMutation } from './user.mutations';

let userProfileHttpService: UserProfileHttpService;
const userId = '60cd1862629e063c384f3ea1';

export enum UserAction {
    LoadProfile = 'load_profile',
    UpdateUserRatings = 'update_user_ratings'
}

interface ActionAugments extends Omit<ActionContext<IUserState, IUserState>, 'commit'> {
    commit<T extends keyof IUserMutations>(key: T, payload: Parameters<IUserMutations[T]>[1]): ReturnType<IUserMutations[T]>;
}

export interface IUserActions {
    [UserAction.LoadProfile](context: ActionAugments): Promise<void>;
    [UserAction.UpdateUserRatings](context: ActionAugments, payload: PerformanceRating): Promise<boolean>;
}

export const setActionServices = (userProfileHttp: UserProfileHttpService): void => {
    userProfileHttpService = userProfileHttp;
}

export const actions: ActionTree<IUserState, IUserState> & IUserActions = {
    async [UserAction.LoadProfile](context: ActionAugments): Promise<void> {
        const user = await userProfileHttpService.getUserProfile(userId);
        context.commit(UserMutation.SetProfile, user);
    },
    async [UserAction.UpdateUserRatings](context: ActionAugments, payload: PerformanceRating): Promise<boolean> {
        const ratings = await userProfileHttpService.updateUserRatings(userId, payload);

        if (ratings) {
            const user: UserProfile = { ...context.state.profile!, ratings };
            context.commit(UserMutation.SetProfile, user);
        }

        return Boolean(ratings);
    }
};
