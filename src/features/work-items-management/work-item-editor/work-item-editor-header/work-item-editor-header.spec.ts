import { shallowMount, VueWrapper } from '@vue/test-utils';

import { WorkItem } from '../../../../core/models/work-item/work-item';
import { WorkItemType } from '../../../../core/enums/work-item-type.enum';

import WorkItemEditorHeader from './work-item-editor-header.vue';

describe('work item editor header unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(WorkItemEditorHeader);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('typeOptions', () => {
        test('should return correct type options', () => {
            expect(component.vm.typeOptions.length).toEqual(3);
            expect(component.vm.typeOptions[0].value).toEqual(WorkItemType.Regular);
            expect(component.vm.typeOptions[0].colorType).toEqual('activity-colors-regular');
            expect(component.vm.typeOptions[1].value).toEqual(WorkItemType.Recurring);
            expect(component.vm.typeOptions[1].colorType).toEqual('activity-colors-recurring');
            expect(component.vm.typeOptions[2].value).toEqual(WorkItemType.Interruption);
            expect(component.vm.typeOptions[2].colorType).toEqual('activity-colors-interruption');
        });
    });

    describe('onTypeChange', () => {
        test('should emit event on type change', async() => {
            const item: WorkItem = {
                ...new WorkItem(),
                type: WorkItemType.Regular,
                dueDate: new Date(2021, 0, 1).toISOString()
            };

            await component.setProps({ item });
            expect(component.vm.item.dueDate).toBeTruthy();

            component.vm.onTypeChange();

            expect(component.emitted()['item:update'].length).toEqual(1);
            expect(component.vm.item.dueDate).toBeTruthy();
        });

        test('should remove due date for non regular types', async() => {
            const item: WorkItem = {
                ...new WorkItem(),
                type: WorkItemType.Interruption,
                dueDate: new Date(2021, 0, 1).toISOString()
            };

            await component.setProps({ item });
            expect(component.vm.item.dueDate).toBeTruthy();

            component.vm.onTypeChange();

            expect(component.emitted()['item:update'].length).toEqual(1);
            expect(component.vm.item.dueDate).toBeFalsy();
        });
    });
});
