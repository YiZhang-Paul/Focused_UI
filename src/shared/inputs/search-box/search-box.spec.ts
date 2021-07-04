import { shallowMount, VueWrapper } from '@vue/test-utils';

import SearchBox from './search-box.vue';

describe('search box unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(SearchBox);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('onSearch', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        test('should default to empty string for invalid search text value', () => {
            component.vm.onSearch(null);
            jest.advanceTimersByTime(200);

            expect(component.emitted().search).toBeFalsy();
        });

        test('should emit nothing when search text is not changed', () => {
            component.vm.onSearch('search_text');
            jest.advanceTimersByTime(200);
            const emitCount = component.emitted().search.length;

            component.vm.onSearch('search_text');
            jest.advanceTimersByTime(200);
            expect(component.emitted().search.length).toEqual(emitCount);

            component.vm.onSearch(' search_text ');
            jest.advanceTimersByTime(200);
            expect(component.emitted().search.length).toEqual(emitCount);
        });

        test('should debounce on search', () => {
            component.vm.onSearch('search_text');
            jest.advanceTimersByTime(150);
            expect(component.emitted().search).toBeFalsy();

            component.vm.onSearch('different_search_text');
            jest.advanceTimersByTime(50);
            expect(component.emitted().search).toBeFalsy();

            component.vm.onSearch('final_search_text');
            jest.advanceTimersByTime(150);
            expect(component.emitted().search).toBeFalsy();

            jest.advanceTimersByTime(50);
            expect(component.emitted().search.length).toEqual(1);
            expect(component.emitted().search[0]).toEqual(['final_search_text']);
        });
    });
});
