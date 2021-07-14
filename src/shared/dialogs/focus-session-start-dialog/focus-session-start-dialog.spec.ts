import { shallowMount, VueWrapper } from '@vue/test-utils';

import { WorkItemDto } from '../../../core/dtos/work-item-dto';
import { FocusSessionStartDialogOption } from '../../../core/models/time-session/focus-session-start-dialog-option';
import { WorkItemType } from '../../../core/enums/work-item-type.enum';

import FocusSessionStartDialog from './focus-session-start-dialog.vue';

describe('focus session start dialog unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(FocusSessionStartDialog);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('startOption', () => {
        test('should return correct start option', async() => {
            const item: WorkItemDto = { ...new WorkItemDto(), id: 'item_id' };
            const data: FocusSessionStartDialogOption = { ...new FocusSessionStartDialogOption(item), duration: 15 };
            await component.setProps({ data });

            expect(component.vm.startOption.workItemId).toEqual('item_id');
            expect(component.vm.startOption.totalMinutes).toEqual(15);
        });
    });

    describe('typeIcon', () => {
        test('should return type icon', async() => {
            const item: WorkItemDto = { ...new WorkItemDto(), type: WorkItemType.Recurring };
            const data = new FocusSessionStartDialogOption(item);
            await component.setProps({ data });

            expect(component.vm.typeIcon.name).toEqual('recurring');
        });
    });
});
