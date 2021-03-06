import { shallowMount, VueWrapper } from '@vue/test-utils';
import { createStore, Store } from 'vuex';

import { createStore as createWorkItemStore, workItemKey } from '../../../store/work-item/work-item.state';
import { WorkItemDto } from '../../../core/dtos/work-item-dto';
import { WorkItemStatus } from '../../../core/enums/work-item-status.enum';

import WorkItemsList from './work-items-list.vue';

describe('work items list unit test', () => {
    let component: VueWrapper<any>;
    let store: Store<any>;

    beforeEach(() => {
        store = createStore({ modules: { [workItemKey]: createWorkItemStore() } });
        component = shallowMount(WorkItemsList, { global: { mocks: { $store: store } } });
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('onStatusSelected', () => {
        test('should emit updated meta', () => {
            const item: WorkItemDto = { ...new WorkItemDto(), status: WorkItemStatus.Idle };
            const expected: WorkItemDto = { ...new WorkItemDto(), status: WorkItemStatus.Highlighted };

            component.vm.onStatusSelected(item, WorkItemStatus.Highlighted);

            expect(component.emitted()['update:meta'].length).toEqual(1);
            expect(component.emitted()['update:meta'][0]).toEqual([expected]);
        });
    });
});
