import { WorkItemType } from '@/core/enums/work-item-type.enum';
import { shallowMount, VueWrapper } from '@vue/test-utils';

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
});