import { shallowMount, VueWrapper } from '@vue/test-utils';

import { WorkItem } from '../../../core/models/work-item/work-item';
import { ChecklistEntry } from '../../../core/models/work-item/checklist-entry';

import WorkItemEditor from './work-item-editor.vue';

describe('work item editor unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(WorkItemEditor);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('getTime', () => {
        test('should return empty string when time does not exist', () => {
            expect(component.vm.getTime(null)).toEqual('');
        });

        test('should return time string', () => {
            expect(component.vm.getTime(new Date(2021, 1, 5, 17, 13))).toEqual('February 5, 2021, 5:13 PM');
        });
    });

    describe('onChecklistUpdate', () => {
        test('should emit updated checklist', async() => {
            jest.useFakeTimers();
            const checklist = [{ description: 'new_description' } as ChecklistEntry];
            await component.setProps({ item: { checklist: [] as ChecklistEntry[] } as WorkItem });

            component.vm.onChecklistUpdate(checklist);
            jest.advanceTimersByTime(400);

            expect(component.vm.item.checklist).toEqual(checklist);
            expect(component.emitted()['item:update'].length).toEqual(1);
            jest.useRealTimers();
        });
    });

    describe('onUpdate', () => {
        test('should debounce on update', () => {
            jest.useFakeTimers();

            component.vm.onUpdate();
            jest.advanceTimersByTime(399);
            expect(component.emitted()['item:update']).toBeFalsy();

            component.vm.onUpdate();
            jest.advanceTimersByTime(1);
            expect(component.emitted()['item:update']).toBeFalsy();

            jest.advanceTimersByTime(399);
            expect(component.emitted()['item:update'].length).toEqual(1);
            jest.useRealTimers();
        });
    });
});
