import { shallowMount, VueWrapper } from '@vue/test-utils';
import { createStore, Store } from 'vuex';

import { createStore as createUserStore, userKey } from '../../../store/user/user.state';
import { UserProfile } from '../../../core/models/user/user-profile';
import { PerformanceRating } from '../../../core/models/user/performance-rating';

import UserWidget from './user-widget.vue';

describe('user widget unit test', () => {
    let component: VueWrapper<any>;
    let store: Store<any>;

    beforeEach(() => {
        store = createStore({ modules: { [userKey]: createUserStore() } });
        component = shallowMount(UserWidget, { global: { mocks: { $store: store } } });
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('rating', () => {
        test('should return 0 when profile does not exist', () => {
            expect(component.vm.profile).toBeFalsy();
            expect(component.vm.rating).toEqual(0);
        });

        test('should return user rating', () => {
            const ratings = {
                determination: 55,
                estimation: 65,
                planning: 80,
                adaptability: 60,
                sustainability: 40
            } as PerformanceRating;

            store.commit(`${userKey}/setProfile`, { ratings } as UserProfile);

            expect(component.vm.rating).toEqual(60);
        });
    });
});
