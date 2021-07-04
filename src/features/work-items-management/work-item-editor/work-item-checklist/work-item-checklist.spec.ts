import { shallowMount, VueWrapper } from '@vue/test-utils';

import { ChecklistEntry } from '../../../../core/models/work-item/checklist-entry';

import WorkItemChecklist from './work-item-checklist.vue';

describe('work item checklist unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(WorkItemChecklist);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('toggleCompletion', () => {
        test('should toggle completion status', async() => {
            const entries: ChecklistEntry[] = [
                { description: 'description_1', isCompleted: true },
                { description: 'description_2', isCompleted: true }
            ];

            const expected: ChecklistEntry[] = [
                { description: 'description_1', isCompleted: true },
                { description: 'description_2', isCompleted: false }
            ];

            await component.setProps({ entries });

            component.vm.toggleCompletion(1);

            expect(component.emitted().update.length).toEqual(1);
            expect(component.emitted().update[0]).toEqual([expected]);
        });
    });

    describe('deleteEntry', () => {
        test('should emit remaining entries', async() => {
            const entries: ChecklistEntry[] = [
                { description: 'description_1', isCompleted: false },
                { description: 'description_2', isCompleted: false },
                { description: 'description_3', isCompleted: false }
            ];

            await component.setProps({ entries });

            component.vm.deleteEntry(1);

            expect(component.emitted().update.length).toEqual(1);
            expect(component.emitted().update[0]).toEqual([[entries[0], entries[2]]]);
        });
    });

    describe('addEntry', () => {
        test('should do nothing when no pending entry exists', () => {
            component.vm.pendingEntry = '';

            component.vm.addEntry();

            expect(component.emitted().update).toBeFalsy();
        });

        test('should emit new entry', async() => {
            const entries: ChecklistEntry[] = [{ description: 'description_1', isCompleted: false }];
            const expected: ChecklistEntry[] = [...entries, { description: 'new_description', isCompleted: false }];
            await component.setProps({ entries });
            component.vm.pendingEntry = 'new_description';

            component.vm.addEntry();

            expect(component.emitted().update.length).toEqual(1);
            expect(component.emitted().update[0]).toEqual([expected]);
            expect(component.vm.pendingEntry).toEqual('');
        });
    });
});
