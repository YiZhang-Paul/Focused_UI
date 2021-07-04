import { shallowMount, VueWrapper } from '@vue/test-utils';

import { WorkItemDto } from '../../../core/dtos/work-item-dto';
import { WorkItemPriority } from '../../../core/enums/work-item-priority.enum';

import ItemThumbnailScrollbar from './item-thumbnail-scrollbar.vue';

describe('item thumbnail scrollbar unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(ItemThumbnailScrollbar);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('thumbStyle', () => {
        test('should return correct thumb style', () => {
            component.vm.scrollTop = 5;
            component.vm.scrollHeight = 250;
            component.vm.clientHeight = 350;

            expect(component.vm.thumbStyle.top).toEqual('5px');
            expect(component.vm.thumbStyle.height).toEqual('450px');
        });
    });

    describe('getBlockStyle', () => {
        test('should return correct block style', async() => {
            const items: WorkItemDto[] = [
                { ...new WorkItemDto(), priority: WorkItemPriority.ImportantNotUrgent },
                { ...new WorkItemDto(), priority: WorkItemPriority.UrgentNotImportant },
                { ...new WorkItemDto(), priority: WorkItemPriority.UrgentImportant },
                { ...new WorkItemDto(), priority: WorkItemPriority.NotUrgentNotImportant }
            ];

            await component.setProps({ items });

            const result = component.vm.getBlockStyle(items[1]);

            expect(result.height).toEqual('25%');
            expect(result['background-color']).toEqual('var(--priority-colors-2-08)');
            expect(result['box-shadow']).toEqual('0 0 4px var(--priority-colors-2-08)');
        });
    });
});
