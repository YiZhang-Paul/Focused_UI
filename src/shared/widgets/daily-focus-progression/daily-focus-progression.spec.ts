import { shallowMount, VueWrapper } from '@vue/test-utils';
import { createStore, Store } from 'vuex';

import { createStore as createPerformanceStore, performanceKey } from '../../../store/performance/performance.state';
import { ProgressionCounter } from '../../../core/models/generic/progression-counter';

import DailyFocusProgression from './daily-focus-progression.vue';

describe('daily focus progression unit test', () => {
    let component: VueWrapper<any>;
    let store: Store<any>;

    beforeEach(() => {
        store = createStore({ modules: { [performanceKey]: createPerformanceStore() } });
        component = shallowMount(DailyFocusProgression, { global: { mocks: { $store: store } } });
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('hoursFocused', () => {
        test('should return 0 when no hours focused', () => {
            const progress: ProgressionCounter<number> = { current: 0, target: 8, isCompleted: false };
            store.commit(`${performanceKey}/setCurrentDayProgression`, progress);

            expect(component.vm.hoursFocused).toEqual('0 hour');
        });

        test('should return hours focused', () => {
            const progress: ProgressionCounter<number> = { current: 5.4, target: 8, isCompleted: false };
            store.commit(`${performanceKey}/setCurrentDayProgression`, progress);

            expect(component.vm.hoursFocused).toEqual('5.4 hours');
        });
    });

    describe('percentage', () => {
        test('should return 0 when no hours focused', () => {
            const progress: ProgressionCounter<number> = { current: 0, target: 10, isCompleted: false };
            store.commit(`${performanceKey}/setCurrentDayProgression`, progress);

            expect(component.vm.percentage).toEqual('0%');
        });

        test('should return correct percentage', () => {
            const progress: ProgressionCounter<number> = { current: 5.5, target: 10, isCompleted: false };
            store.commit(`${performanceKey}/setCurrentDayProgression`, progress);

            expect(component.vm.percentage).toEqual('55%');
        });
    });

    describe('percentageStyle', () => {
        test('should return correct percentage style', () => {
            const mutation = `${performanceKey}/setCurrentDayProgression`;

            store.commit(mutation, { ...new ProgressionCounter<number>(), current: 0 });
            expect(component.vm.percentageStyle.color).toEqual('var(--focus-progress-colors-insufficient-00)');

            store.commit(mutation, { ...new ProgressionCounter<number>(), current: 5 });
            expect(component.vm.percentageStyle.color).toEqual('var(--focus-progress-colors-insufficient-00)');

            store.commit(mutation, { ...new ProgressionCounter<number>(), current: 6 });
            expect(component.vm.percentageStyle.color).toEqual('var(--focus-progress-colors-sufficient-00)');

            store.commit(mutation, { ...new ProgressionCounter<number>(), current: 11 });
            expect(component.vm.percentageStyle.color).toEqual('var(--focus-progress-colors-sufficient-00)');

            store.commit(mutation, { ...new ProgressionCounter<number>(), current: 12 });
            expect(component.vm.percentageStyle.color).toEqual('var(--focus-progress-colors-overdoing-00)');

            store.commit(mutation, { ...new ProgressionCounter<number>(), current: 18 });
            expect(component.vm.percentageStyle.color).toEqual('var(--focus-progress-colors-overdoing-00)');
        });
    });
});
