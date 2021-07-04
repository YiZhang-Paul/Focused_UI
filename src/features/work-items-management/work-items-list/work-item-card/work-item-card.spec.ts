import { shallowMount, VueWrapper } from '@vue/test-utils';

import { WorkItemDto } from '../../../../core/dtos/work-item-dto';
import { WorkItemType } from '../../../../core/enums/work-item-type.enum';
import { WorkItemPriority } from '../../../../core/enums/work-item-priority.enum';

import WorkItemCard from './work-item-card.vue';

describe('work item card unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(WorkItemCard);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('priorityStyle', () => {
        test('should return correct priority style', async() => {
            const item: WorkItemDto = { ...new WorkItemDto(), priority: WorkItemPriority.NotUrgentNotImportant };
            await component.setProps({ item });

            expect(/--priority-colors-3-0/.test(component.vm.priorityStyle.background)).toBeTruthy();
        });
    });

    describe('typeIcon', () => {
        test('should return type icon', async() => {
            await component.setProps({ item: { ...new WorkItemDto(), type: WorkItemType.Regular } });
            expect(component.vm.typeIcon.name).toEqual('regular');

            await component.setProps({ item: { ...new WorkItemDto(), type: WorkItemType.Recurring } });
            expect(component.vm.typeIcon.name).toEqual('recurring');

            await component.setProps({ item: { ...new WorkItemDto(), type: WorkItemType.Interruption } });
            expect(component.vm.typeIcon.name).toEqual('interruption');
        });
    });

    describe('onEditConfirm', () => {
        test('should do nothing if item name is empty', async() => {
            const item: WorkItemDto = { ...new WorkItemDto(), name: '' };
            await component.setProps({ item });

            component.vm.onEditConfirm();

            expect(component.emitted()['edit:confirm']).toBeFalsy();
        });

        test('should do nothing if item name is white space', async() => {
            const item: WorkItemDto = { ...new WorkItemDto(), name: ' ' };
            await component.setProps({ item });

            component.vm.onEditConfirm();

            expect(component.emitted()['edit:confirm']).toBeFalsy();
        });

        test('should emit trimmed edited name', async() => {
            const item: WorkItemDto = { ...new WorkItemDto(), name: ' edited_name ' };
            await component.setProps({ item });

            component.vm.onEditConfirm();

            expect(component.vm.item.name).toEqual('edited_name');
            expect(component.emitted()['edit:confirm'].length).toEqual(1);
        });
    });
});
