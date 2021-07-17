import { createStore, Store } from 'vuex';
import { assert as sinonExpect, createStubInstance, SinonStubbedInstance } from 'sinon';

import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { UserProfile } from '../../core/models/user/user-profile';
import { PerformanceRating } from '../../core/models/user/performance-rating';
import { UserProfileHttpService } from '../../core/services/http/user-profile-http/user-profile-http.service';

import { IState } from './user.state';
import { GetterKey } from './user.getters';
import { MutationKey } from './user.mutations';
import { ActionKey } from './user.actions';
import { createStore as createUserStore, userCommit, userDispatch, userGetters, userKey } from './user.store';

describe('user store unit test', () => {
    let store: Store<IState>;
    let userProfileHttpStub: SinonStubbedInstance<UserProfileHttpService>;

    beforeEach(() => {
        userProfileHttpStub = createStubInstance(UserProfileHttpService);

        container
            .rebind<UserProfileHttpService>(types.UserProfileHttpService)
            .toConstantValue(userProfileHttpStub as unknown as UserProfileHttpService);

        store = createStore({ modules: { [userKey]: createUserStore() } });
    });

    describe('loadProfile', () => {
        test('should load user profile', async() => {
            const user: UserProfile = { ...new UserProfile(), name: 'john doe' };
            userProfileHttpStub.getUserProfile.resolves(user);
            expect(userGetters(store, GetterKey.Profile)).not.toEqual(user);

            await userDispatch(store, ActionKey.LoadProfile);

            sinonExpect.calledOnce(userProfileHttpStub.getUserProfile);
            expect(userGetters(store, GetterKey.Profile)).toEqual(user);
        });
    });

    describe('updateUserRatings', () => {
        test('should return false when failed to update ratings', async() => {
            const user: UserProfile = {
                ...new UserProfile(),
                ratings: { ...new PerformanceRating(), estimation: 0.65 }
            };

            userProfileHttpStub.updateUserRatings.resolves(null);
            userCommit(store, MutationKey.SetProfile, user);

            const result = await userDispatch(store, ActionKey.UpdateUserRatings);

            sinonExpect.calledOnce(userProfileHttpStub.updateUserRatings);
            expect(result).toBeFalsy();
            expect(userGetters(store, GetterKey.Profile)).toEqual(user);
        });

        test('should return true when successfully updated ratings', async() => {
            const user: UserProfile = {
                ...new UserProfile(),
                ratings: { ...new PerformanceRating(), estimation: 0.65 }
            };

            const rating: PerformanceRating = { ...new PerformanceRating(), estimation: 0.8 };
            userProfileHttpStub.updateUserRatings.resolves(rating);
            userCommit(store, MutationKey.SetProfile, user);

            const result = await userDispatch(store, ActionKey.UpdateUserRatings);

            sinonExpect.calledOnce(userProfileHttpStub.updateUserRatings);
            expect(result).toBeTruthy();
            expect(userGetters(store, GetterKey.Profile)?.ratings).toEqual(rating);
        });
    });
});
