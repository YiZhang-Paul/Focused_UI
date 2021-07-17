import { assert as sinonExpect, createStubInstance, SinonStubbedInstance } from 'sinon';

import { createStore } from '../../store';
import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { UserProfile } from '../../core/models/user/user-profile';
import { PerformanceRating } from '../../core/models/user/performance-rating';
import { UserProfileHttpService } from '../../core/services/http/user-profile-http/user-profile-http.service';

describe('user store unit test', () => {
    let store: ReturnType<typeof createStore>;
    let userProfileHttpStub: SinonStubbedInstance<UserProfileHttpService>;

    beforeEach(() => {
        userProfileHttpStub = createStubInstance(UserProfileHttpService);

        container
            .rebind<UserProfileHttpService>(types.UserProfileHttpService)
            .toConstantValue(userProfileHttpStub as unknown as UserProfileHttpService);

        store = createStore();
    });

    describe('loadProfile', () => {
        test('should load user profile', async() => {
            const user: UserProfile = { ...new UserProfile(), name: 'john doe' };
            userProfileHttpStub.getUserProfile.resolves(user);
            expect(store.user.getters(store.store, store.user.keys.getters.Profile)).not.toEqual(user);

            await store.user.dispatch(store.store, store.user.keys.actions.LoadProfile);

            sinonExpect.calledOnce(userProfileHttpStub.getUserProfile);
            expect(store.user.getters(store.store, store.user.keys.getters.Profile)).toEqual(user);
        });
    });

    describe('updateUserRatings', () => {
        test('should return false when failed to update ratings', async() => {
            const user: UserProfile = {
                ...new UserProfile(),
                ratings: { ...new PerformanceRating(), estimation: 0.65 }
            };

            userProfileHttpStub.updateUserRatings.resolves(null);
            store.user.commit(store.store, store.user.keys.mutations.SetProfile, user);

            const result = await store.user.dispatch(store.store, store.user.keys.actions.UpdateUserRatings);

            sinonExpect.calledOnce(userProfileHttpStub.updateUserRatings);
            expect(result).toBeFalsy();
            expect(store.user.getters(store.store, store.user.keys.getters.Profile)).toEqual(user);
        });

        test('should return true when successfully updated ratings', async() => {
            const user: UserProfile = {
                ...new UserProfile(),
                ratings: { ...new PerformanceRating(), estimation: 0.65 }
            };

            const rating: PerformanceRating = { ...new PerformanceRating(), estimation: 0.8 };
            userProfileHttpStub.updateUserRatings.resolves(rating);
            store.user.commit(store.store, store.user.keys.mutations.SetProfile, user);

            const result = await store.user.dispatch(store.store, store.user.keys.actions.UpdateUserRatings);

            sinonExpect.calledOnce(userProfileHttpStub.updateUserRatings);
            expect(result).toBeTruthy();
            expect(store.user.getters(store.store, store.user.keys.getters.Profile)?.ratings).toEqual(rating);
        });
    });
});
