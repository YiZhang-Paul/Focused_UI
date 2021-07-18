import { shallowMount, VueWrapper } from '@vue/test-utils';

import { createStore } from '../../../store';
import { UserProfile } from '../../../core/models/user/user-profile';
import { PerformanceRating } from '../../../core/models/user/performance-rating';

import UserWidget from './user-widget.vue';

describe('user widget unit test', () => {
    let component: VueWrapper<any>;
    let store: ReturnType<typeof createStore>;

    beforeEach(() => {
        store = createStore();
        component = shallowMount(UserWidget, { global: { mocks: { $store: store.store } } });
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
            const ratings: PerformanceRating = {
                determination: 0.55,
                estimation: 0.65,
                planning: 0.8,
                adaptability: 0.6,
                sustainability: 0.4
            };

            store.user.commit(store.user.mutation.SetProfile, { ...new UserProfile(), ratings });

            expect(component.vm.rating).toEqual(60);
        });
    });
});
