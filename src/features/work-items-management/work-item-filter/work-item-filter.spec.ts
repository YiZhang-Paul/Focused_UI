import { shallowMount, VueWrapper } from '@vue/test-utils';

import { WorkItemQuery } from '../../../core/models/work-item/work-item-query';
import { WorkItemType } from '../../../core/enums/work-item-type.enum';

import WorkItemFilter from './work-item-filter.vue';

describe('work item filter unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(WorkItemFilter);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('onSearch', () => {
        test('should set query properly with search text', () => {
            component.vm.onSearch('search_text');

            expect(component.emitted()['item:filter'].length).toEqual(1);
            expect((component.emitted()['item:filter'][0] as WorkItemQuery[])[0].searchText).toEqual('search_text');
        });
    });

    describe('onCompletionFilter', () => {
        test('should set query properly when no filter is applied', () => {
            component.vm.completionFilterOptions[0].isActive = true;
            component.vm.completionFilterOptions[1].isActive = false;
            component.vm.completionFilterOptions[2].isActive = false;

            component.vm.onCompletionFilter();

            expect(component.emitted()['item:filter'].length).toEqual(1);
            expect((component.emitted()['item:filter'][0] as WorkItemQuery[])[0].isCompleted).toBeUndefined();
        });

        test('should set query properly when completed filter is applied', () => {
            component.vm.completionFilterOptions[0].isActive = false;
            component.vm.completionFilterOptions[1].isActive = true;
            component.vm.completionFilterOptions[2].isActive = false;

            component.vm.onCompletionFilter();

            expect(component.emitted()['item:filter'].length).toEqual(1);
            expect((component.emitted()['item:filter'][0] as WorkItemQuery[])[0].isCompleted).toEqual(true);
        });

        test('should reset highlight filter when completed filter is applied', () => {
            component.vm.highlightFilterOptions[0].isActive = false;
            component.vm.highlightFilterOptions[1].isActive = true;
            component.vm.highlightFilterOptions[2].isActive = false;
            component.vm.completionFilterOptions[0].isActive = false;
            component.vm.completionFilterOptions[1].isActive = true;
            component.vm.completionFilterOptions[2].isActive = false;

            component.vm.onCompletionFilter();

            expect(component.emitted()['item:filter'].length).toEqual(1);
            expect((component.emitted()['item:filter'][0] as WorkItemQuery[])[0].isHighlighted).toBeUndefined();
            expect(component.vm.highlightFilterOptions[0].isActive).toBeTruthy();
            expect(component.vm.highlightFilterOptions[1].isActive).toBeFalsy();
            expect(component.vm.highlightFilterOptions[2].isActive).toBeFalsy();
        });

        test('should set query properly when incomplete filter is applied', () => {
            component.vm.completionFilterOptions[0].isActive = false;
            component.vm.completionFilterOptions[1].isActive = false;
            component.vm.completionFilterOptions[2].isActive = true;

            component.vm.onCompletionFilter();

            expect(component.emitted()['item:filter'].length).toEqual(1);
            expect((component.emitted()['item:filter'][0] as WorkItemQuery[])[0].isCompleted).toEqual(false);
        });
    });

    describe('onHighlightFilter', () => {
        test('should set query properly when no filter is applied', () => {
            component.vm.highlightFilterOptions[0].isActive = true;
            component.vm.highlightFilterOptions[1].isActive = false;
            component.vm.highlightFilterOptions[2].isActive = false;

            component.vm.onHighlightFilter();

            expect(component.emitted()['item:filter'].length).toEqual(1);
            expect((component.emitted()['item:filter'][0] as WorkItemQuery[])[0].isHighlighted).toBeUndefined();
        });

        test('should set query properly when highlighted filter is applied', () => {
            component.vm.highlightFilterOptions[0].isActive = false;
            component.vm.highlightFilterOptions[1].isActive = true;
            component.vm.highlightFilterOptions[2].isActive = false;

            component.vm.onHighlightFilter();

            expect(component.emitted()['item:filter'].length).toEqual(1);
            expect((component.emitted()['item:filter'][0] as WorkItemQuery[])[0].isHighlighted).toEqual(true);
        });

        test('should reset completion filter when highlighted filter is applied', () => {
            component.vm.completionFilterOptions[0].isActive = false;
            component.vm.completionFilterOptions[1].isActive = true;
            component.vm.completionFilterOptions[2].isActive = false;
            component.vm.highlightFilterOptions[0].isActive = false;
            component.vm.highlightFilterOptions[1].isActive = true;
            component.vm.highlightFilterOptions[2].isActive = false;

            component.vm.onHighlightFilter();

            expect(component.emitted()['item:filter'].length).toEqual(1);
            expect((component.emitted()['item:filter'][0] as WorkItemQuery[])[0].isCompleted).toBeUndefined();
            expect(component.vm.completionFilterOptions[0].isActive).toBeTruthy();
            expect(component.vm.completionFilterOptions[1].isActive).toBeFalsy();
            expect(component.vm.completionFilterOptions[2].isActive).toBeFalsy();
        });

        test('should set query properly when not highlighted filter is applied', () => {
            component.vm.highlightFilterOptions[0].isActive = false;
            component.vm.highlightFilterOptions[1].isActive = false;
            component.vm.highlightFilterOptions[2].isActive = true;

            component.vm.onHighlightFilter();

            expect(component.emitted()['item:filter'].length).toEqual(1);
            expect((component.emitted()['item:filter'][0] as WorkItemQuery[])[0].isHighlighted).toEqual(false);
        });
    });

    describe('onTypeFilter', () => {
        test('should set query with proper type', () => {
            component.vm.typeFilterOptions[0].isActive = false;
            component.vm.typeFilterOptions[1].isActive = false;
            component.vm.typeFilterOptions[2].isActive = true;
            component.vm.typeFilterOptions[3].isActive = false;

            component.vm.onTypeFilter();

            expect(component.emitted()['item:filter'].length).toEqual(1);
            expect((component.emitted()['item:filter'][0] as WorkItemQuery[])[0].type).toEqual(WorkItemType.Recurring);
        });
    });
});
