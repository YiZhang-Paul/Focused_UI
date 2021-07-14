import { Store } from 'vuex';
import { assert as sinonExpect, createStubInstance, SinonStubbedInstance } from 'sinon';

import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { UserProfile } from '../../core/models/user/user-profile';
import { PerformanceRating } from '../../core/models/user/performance-rating';
import { UserProfileHttpService } from '../../core/services/http/user-profile-http/user-profile-http.service';

import { IUserState, createStore } from './user.state';

describe('user store unit test', () => {
    let store: Store<IUserState>;
    let userProfileHttpStub: SinonStubbedInstance<UserProfileHttpService>;

    beforeEach(() => {
        userProfileHttpStub = createStubInstance(UserProfileHttpService);

        container
            .rebind<UserProfileHttpService>(types.UserProfileHttpService)
            .toConstantValue(userProfileHttpStub as unknown as UserProfileHttpService);

        store = new Store(createStore());
    });

    describe('loadProfile', () => {
        test('should load user profile', async() => {
            const user: UserProfile = { ...new UserProfile(), name: 'john doe' };
            userProfileHttpStub.getUserProfile.resolves(user);
            expect(store.getters['profile']).not.toEqual(user);

            await store.dispatch('loadProfile');

            sinonExpect.calledOnce(userProfileHttpStub.getUserProfile);
            expect(store.getters['profile']).toEqual(user);
        });
    });

    describe('updateUserRatings', () => {
        test('should return false when failed to update ratings', async() => {
            const user: UserProfile = {
                ...new UserProfile(),
                ratings: { ...new PerformanceRating(), estimation: 0.65 }
            };

            userProfileHttpStub.updateUserRatings.resolves(null);
            store.commit('setProfile', user);

            const result = await store.dispatch('updateUserRatings');

            sinonExpect.calledOnce(userProfileHttpStub.updateUserRatings);
            expect(result).toBeFalsy();
            expect(store.getters['profile']).toEqual(user);
        });

        test('should return true when successfully updated ratings', async() => {
            const user: UserProfile = {
                ...new UserProfile(),
                ratings: { ...new PerformanceRating(), estimation: 0.65 }
            };

            const rating: PerformanceRating = { ...new PerformanceRating(), estimation: 0.8 };
            userProfileHttpStub.updateUserRatings.resolves(rating);
            store.commit('setProfile', user);

            const result = await store.dispatch('updateUserRatings');

            sinonExpect.calledOnce(userProfileHttpStub.updateUserRatings);
            expect(result).toBeTruthy();
            expect(store.getters['profile'].ratings).toEqual(rating);
        });
    });
});
