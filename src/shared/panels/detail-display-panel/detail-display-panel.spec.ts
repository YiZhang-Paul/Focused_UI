import { shallowMount, VueWrapper } from '@vue/test-utils';

import DetailDisplayPanel from './detail-display-panel.vue';

describe('detail display panel unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(DetailDisplayPanel);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('mounted', () => {
        test('should show content after 600 milliseconds', async() => {
            jest.useFakeTimers();
            component = shallowMount(DetailDisplayPanel);
            expect(component.vm.showContent).toBeFalsy();

            jest.advanceTimersByTime(600);

            expect(component.vm.showContent).toBeTruthy();
            jest.useRealTimers();
        });
    });
});
