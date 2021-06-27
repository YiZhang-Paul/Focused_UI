import { markRaw } from '@vue/reactivity';
import { shallowMount, VueWrapper } from '@vue/test-utils';
import { Plus } from 'mdue';

import ItemProgression from './item-progression.vue';

describe('item progression unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(ItemProgression);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('progressIcon', () => {
        test('should use default icon when applicable', async() => {
            await component.setProps({ icon: markRaw(Plus) });
            expect(component.vm.progressIcon).toBeTruthy();

            await component.setProps({ icon: null });
            expect(component.vm.progressIcon).toBeTruthy();
        });
    });
});
