import { shallowMount, VueWrapper } from '@vue/test-utils';
import { assert as sinonExpect, createStubInstance, SinonStubbedInstance } from 'sinon';
import { createStore, Store } from 'vuex';

import { createStore as createTimeSessionStore, timeSessionKey } from '../../store/time-session/time-session.state';
import { createStore as createWorkItemStore, workItemKey } from '../../store/work-item/work-item.state';
import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { FocusSessionDto } from '../../core/dtos/focus-session-dto';
import { WorkItemDto } from '../../core/dtos/work-item-dto';
import { WorkItem } from '../../core/models/work-item/work-item';
import { WorkItemHttpService } from '../../core/services/http/work-item-http/work-item-http.service';

import WorkItemsManagement from './work-items-management.vue';

describe('work items management unit test', () => {
    let component: VueWrapper<any>;
    let store: Store<any>;
    let workItemHttpStub: SinonStubbedInstance<WorkItemHttpService>;

    beforeEach(() => {
        workItemHttpStub = createStubInstance(WorkItemHttpService);
        workItemHttpStub.getWorkItems.resolves([]);

        container
            .rebind<WorkItemHttpService>(types.WorkItemHttpService)
            .toConstantValue(workItemHttpStub as unknown as WorkItemHttpService);

        store = createStore({
            modules: {
                [timeSessionKey]: createTimeSessionStore(),
                [workItemKey]: createWorkItemStore()
            }
        });

        component = shallowMount(WorkItemsManagement, { global: { mocks: { $store: store } } });
    });

    beforeEach(() => {
        // called once on component create
        workItemHttpStub.getWorkItems.resetHistory();
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('startCreate', () => {
        test('should create pending work item', () => {
            expect(component.vm.pendingItem).toBeFalsy();

            component.vm.startCreate();

            expect(component.vm.pendingItem).toBeTruthy();
        });
    });

    describe('cancelCreate', () => {
        test('should remove pending work item', () => {
            store.commit(`${workItemKey}/setPendingWorkItem`, new WorkItemDto());
            expect(component.vm.pendingItem).toBeTruthy();

            component.vm.cancelCreate();

            expect(component.vm.pendingItem).toBeFalsy();
        });
    });

    describe('confirmCreate', () => {
        beforeEach(() => {
            store.commit(`${workItemKey}/setPendingWorkItem`, new WorkItemDto());
        });

        test('should do nothing on creation failure', async() => {
            workItemHttpStub.createWorkItem.resolves(null);

            await component.vm.confirmCreate();

            sinonExpect.calledOnce(workItemHttpStub.createWorkItem);
            sinonExpect.notCalled(workItemHttpStub.getWorkItem);
            sinonExpect.notCalled(workItemHttpStub.getWorkItems);
        });

        test('should open created work item and reload work items on creation success', async() => {
            workItemHttpStub.createWorkItem.resolves('12345');

            await component.vm.confirmCreate();

            sinonExpect.calledOnce(workItemHttpStub.createWorkItem);
            sinonExpect.calledOnce(workItemHttpStub.getWorkItem);
            sinonExpect.calledOnce(workItemHttpStub.getWorkItems);
        });
    });

    describe('onItemMetaUpdate', () => {
        test('should not emit anything when update failed', async() => {
            workItemHttpStub.updateWorkItemMeta.resolves(null);

            await component.vm.onItemMetaUpdate(new WorkItemDto());

            expect(component.emitted()['item:update']).toBeFalsy();
        });

        test('should emit when updated successfully', async() => {
            workItemHttpStub.updateWorkItemMeta.resolves(new WorkItemDto());

            await component.vm.onItemMetaUpdate(new WorkItemDto());

            expect(component.emitted()['item:update'].length).toEqual(1);
        });
    });

    describe('onItemClose', () => {
        test('should close edited item', () => {
            const item: WorkItem = { ...new WorkItem(), id: '1' };
            const meta: WorkItemDto = { ...new WorkItemDto(), id: '1' };
            store.commit(`${workItemKey}/setWorkItems`, [meta]);
            store.commit(`${workItemKey}/setEditedWorkItem`, item);
            expect(component.vm.editedItem).toBeTruthy();
            expect(component.vm.editedItemMeta).toBeTruthy();

            component.vm.onItemClose();

            expect(component.vm.editedItem).toBeFalsy();
            expect(component.vm.editedItemMeta).toBeFalsy();
        });
    });

    describe('onItemUpdate', () => {
        test('should not emit anything when update failed', async() => {
            workItemHttpStub.updateWorkItem.resolves(null);

            await component.vm.onItemUpdate(new WorkItem());

            expect(component.emitted()['item:update']).toBeFalsy();
        });

        test('should emit when updated successfully', async() => {
            workItemHttpStub.updateWorkItem.resolves(new WorkItem());

            await component.vm.onItemUpdate(new WorkItem());

            expect(component.emitted()['item:update'].length).toEqual(1);
        });
    });

    describe('onItemDelete', () => {
        test('should not emit anything when delete failed', async() => {
            workItemHttpStub.deleteWorkItem.resolves(false);

            await component.vm.onItemDelete('12345');

            expect(component.emitted()['item:delete']).toBeFalsy();
        });

        test('should emit when deleted successfully', async() => {
            workItemHttpStub.deleteWorkItem.resolves(true);

            await component.vm.onItemDelete('12345');

            expect(component.emitted()['item:delete'].length).toEqual(1);
        });
    });

    describe('onItemStart', () => {
        test('should start work item when active focus session exists', async() => {
            store.commit(`${timeSessionKey}/setActiveFocusSession`, new FocusSessionDto());

            await component.vm.onItemStart('12345');

            sinonExpect.calledOnce(workItemHttpStub.startWorkItem);
        });
    });

    describe('onItemStop', () => {
        test('should stop work item', async() => {
            await component.vm.onItemStop();

            sinonExpect.calledOnce(workItemHttpStub.stopWorkItem);
        });
    });
});
