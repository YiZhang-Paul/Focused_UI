import { shallowMount, VueWrapper } from '@vue/test-utils';

import { createStore } from '../../../store';
import { ProgressionCounter } from '../../../core/models/generic/progression-counter';

import DailyFocusProgression from './daily-focus-progression.vue';

describe('daily focus progression unit test', () => {
    let component: VueWrapper<any>;
    let store: ReturnType<typeof createStore>;

    beforeEach(() => {
        store = createStore();
        component = shallowMount(DailyFocusProgression, { global: { mocks: { $store: store.store } } });
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('hoursFocused', () => {
        test('should return 0 when no hours focused', () => {
            const progress: ProgressionCounter<number> = { current: 0, target: 8, isCompleted: false };
            store.performance.commit(store.store, store.performance.keys.mutations.SetCurrentDayProgression, progress);

            expect(component.vm.hoursFocused).toEqual('0 hour');
        });

        test('should return hours focused', () => {
            const progress: ProgressionCounter<number> = { current: 5.4, target: 8, isCompleted: false };
            store.performance.commit(store.store, store.performance.keys.mutations.SetCurrentDayProgression, progress);

            expect(component.vm.hoursFocused).toEqual('5.4 hours');
        });
    });

    describe('percentage', () => {
        test('should return 0 when no hours focused', () => {
            const progress: ProgressionCounter<number> = { current: 0, target: 10, isCompleted: false };
            store.performance.commit(store.store, store.performance.keys.mutations.SetCurrentDayProgression, progress);

            expect(component.vm.percentage).toEqual('0%');
        });

        test('should return correct percentage', () => {
            const progress: ProgressionCounter<number> = { current: 5.5, target: 10, isCompleted: false };
            store.performance.commit(store.store, store.performance.keys.mutations.SetCurrentDayProgression, progress);

            expect(component.vm.percentage).toEqual('55%');
        });
    });

    describe('percentageStyle', () => {
        test('should return correct percentage style', () => {
            const mutation = store.performance.keys.mutations.SetCurrentDayProgression;

            store.performance.commit(store.store, mutation, { ...new ProgressionCounter<number>(), current: 0 });
            expect(component.vm.percentageStyle.color).toEqual('var(--context-colors-alert-00)');

            store.performance.commit(store.store, mutation, { ...new ProgressionCounter<number>(), current: 5 });
            expect(component.vm.percentageStyle.color).toEqual('var(--context-colors-alert-00)');

            store.performance.commit(store.store, mutation, { ...new ProgressionCounter<number>(), current: 6 });
            expect(component.vm.percentageStyle.color).toEqual('var(--context-colors-regular-00)');

            store.performance.commit(store.store, mutation, { ...new ProgressionCounter<number>(), current: 11 });
            expect(component.vm.percentageStyle.color).toEqual('var(--context-colors-regular-00)');

            store.performance.commit(store.store, mutation, { ...new ProgressionCounter<number>(), current: 12 });
            expect(component.vm.percentageStyle.color).toEqual('var(--context-colors-warning-00)');

            store.performance.commit(store.store, mutation, { ...new ProgressionCounter<number>(), current: 18 });
            expect(component.vm.percentageStyle.color).toEqual('var(--context-colors-warning-00)');
        });
    });
});
