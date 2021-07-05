import { shallowMount, VueWrapper } from '@vue/test-utils';

import DialogPanel from './dialog-panel.vue';

describe('dialog panel unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(DialogPanel);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('mounted', () => {
        test('should show content after animation finish', () => {
            jest.useFakeTimers();
            component = shallowMount(DialogPanel);
            expect(component.vm.showDialog).toBeFalsy();

            jest.advanceTimersByTime(500);

            expect(component.vm.showDialog).toBeTruthy();
            jest.useRealTimers();
        });
    });
});
