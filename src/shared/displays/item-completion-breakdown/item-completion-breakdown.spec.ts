import { shallowMount, VueWrapper } from '@vue/test-utils';

import { WorkItemDto } from '../../../core/dtos/work-item-dto';
import { ProgressionCounter } from '../../../core/models/generic/progression-counter';
import { WorkItemType } from '../../../core/enums/work-item-type.enum';

import ItemCompletionBreakdown from './item-completion-breakdown.vue';

describe('item completion breakdown unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(ItemCompletionBreakdown);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('groups', () => {
        test('should properly group items base on completion status', async() => {
            const items: WorkItemDto[] = [
                {
                    ...new WorkItemDto(),
                    id: 'id_1',
                    itemProgress: { ...new ProgressionCounter<number>(), isCompleted: true }
                },
                {
                    ...new WorkItemDto(),
                    id: 'id_2',
                    itemProgress: { ...new ProgressionCounter<number>(), isCompleted: false }
                },
                {
                    ...new WorkItemDto(),
                    id: 'id_3',
                    itemProgress: { ...new ProgressionCounter<number>(), isCompleted: true }
                },
                {
                    ...new WorkItemDto(),
                    id: 'id_4',
                    itemProgress: { ...new ProgressionCounter<number>(), isCompleted: false }
                }
            ];

            await component.setProps({ items });

            expect(component.vm.groups[0].items).toEqual([items[0], items[2]]);
            expect(component.vm.groups[1].items).toEqual([items[1], items[3]]);
        });
    });

    describe('getTypeIcon', () => {
        test('should return type icon', () => {
            expect(component.vm.getTypeIcon(WorkItemType.Recurring).name).toEqual('recurring');
        });
    });

    describe('getElapsedTime', () => {
        test('should return correct time when under 1 minute', () => {
            const item: WorkItemDto = {
                ...new WorkItemDto(),
                itemProgress: { ...new ProgressionCounter<number>(), current: 0.005 }
            };

            expect(component.vm.getElapsedTime(item)).toEqual('< 1 minute');
        });

        test('should return correct time when more than or equal to 1 minute', () => {
            const item: WorkItemDto = {
                ...new WorkItemDto(),
                itemProgress: { ...new ProgressionCounter<number>(), current: 0.01 }
            };

            expect(component.vm.getElapsedTime(item)).toEqual('1 minute');

            item.itemProgress.current = 0.1;

            expect(component.vm.getElapsedTime(item)).toEqual('6 minutes');
        });
    });
});
