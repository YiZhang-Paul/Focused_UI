import { shallowMount, VueWrapper } from '@vue/test-utils';

import UserWidget from './user-widget.vue';

describe('user widget unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(UserWidget);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('rating', () => {
        test('should return 0 when profile does not exist', () => {
            expect(component.vm.profile).toBeFalsy();
            expect(component.vm.rating).toEqual(0);
        });
    });
});
