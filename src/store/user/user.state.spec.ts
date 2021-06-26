import { Store } from 'vuex';
import { assert as sinonExpect, createStubInstance, SinonStubbedInstance } from 'sinon';

import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { UserProfile } from '../../core/models/user/user-profile';
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
        let user: UserProfile;

        beforeEach(() => {
            user = { name: 'john doe' } as UserProfile;
            userProfileHttpStub.getUserProfile.resolves(user);
        });

        test('should load user profile', async() => {
            expect(store.getters['profile']).not.toEqual(user);

            await store.dispatch('loadProfile');

            sinonExpect.calledOnce(userProfileHttpStub.getUserProfile);
            expect(store.getters['profile']).toEqual(user);
        });
    });
});
