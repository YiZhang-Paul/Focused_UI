import { createStore, Store } from 'vuex';
import { assert as sinonExpect, createStubInstance, SinonStubbedInstance } from 'sinon';

import { createStore as createTimeSessionStore, timeSessionKey } from '../time-session/time-session.state';
import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { WorkItemDto } from '../../core/dtos/work-item-dto';
import { WorkItem } from '../../core/models/work-item/work-item';
import { WorkItemQuery } from '../../core/models/work-item/work-item-query';
import { WorkItemPriority } from '../../core/enums/work-item-priority.enum';
import { WorkItemType } from '../../core/enums/work-item-type.enum';
import { WorkItemHttpService } from '../../core/services/http/work-item-http/work-item-http.service';

import { createStore as createWorkItemStore, workItemKey } from './work-item.state';

describe('work item store unit test', () => {
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
    });

    describe('editedWorkItemMeta', () => {
        test('should return null when no edited work item exists', () => {
            store.commit(`${workItemKey}/setEditedWorkItem`, null);

            expect(store.getters[`${workItemKey}/editedWorkItemMeta`]).toBeNull();
        });

        test('should return null when edited work item does not exist in work items list', () => {
            const items: WorkItemDto[] = [
                { ...new WorkItemDto(), id: '2' },
                { ...new WorkItemDto(), id: '3' }
            ];

            store.commit(`${workItemKey}/setEditedWorkItem`, { ...new WorkItem(), id: '1' });
            store.commit(`${workItemKey}/setWorkItems`, items);

            expect(store.getters[`${workItemKey}/editedWorkItemMeta`]).toBeNull();
        });

        test('should return edited work item meta', () => {
            const items: WorkItemDto[] = [
                { ...new WorkItemDto(), id: '1' },
                { ...new WorkItemDto(), id: '2' }
            ];

            store.commit(`${workItemKey}/setEditedWorkItem`, { ...new WorkItem(), id: '2' });
            store.commit(`${workItemKey}/setWorkItems`, items);

            expect(store.getters[`${workItemKey}/editedWorkItemMeta`].id).toEqual('2');
        });
    });

    describe('workItems', () => {
        test('should always return sorted work items', () => {
            const unsorted: WorkItemDto[] = [
                { ...new WorkItemDto(), id: '1', priority: WorkItemPriority.NotUrgentNotImportant, type: WorkItemType.Recurring },
                { ...new WorkItemDto(), id: '2', priority: WorkItemPriority.ImportantNotUrgent, type: WorkItemType.Regular },
                { ...new WorkItemDto(), id: '3', priority: WorkItemPriority.ImportantNotUrgent, type: WorkItemType.Recurring },
            ];

            const sorted = [unsorted[2], unsorted[1], unsorted[0]];

            store.commit(`${workItemKey}/setWorkItems`, unsorted);

            expect(store.getters[`${workItemKey}/workItems`]).toEqual(sorted);
        });
    });

    describe('createWorkItem', () => {
        test('should do nothing when no pending work item exists', async() => {
            store.commit(`${workItemKey}/setPendingWorkItem`, null);

            const result = await store.dispatch(`${workItemKey}/createWorkItem`);

            sinonExpect.notCalled(workItemHttpStub.createWorkItem);
            expect(result).toBeNull();
        });

        test('should return null when failed to create work item', async() => {
            workItemHttpStub.createWorkItem.resolves(null);
            store.commit(`${workItemKey}/setPendingWorkItem`, new WorkItemDto());
            expect(store.getters[`${workItemKey}/pendingWorkItem`]).toBeTruthy();

            const result = await store.dispatch(`${workItemKey}/createWorkItem`);

            sinonExpect.calledOnce(workItemHttpStub.createWorkItem);
            expect(store.getters[`${workItemKey}/pendingWorkItem`]).toBeTruthy();
            expect(result).toBeNull();
        });

        test('should return work item id and clear pending work item on creation success', async() => {
            workItemHttpStub.createWorkItem.resolves('1234567890');
            store.commit(`${workItemKey}/setPendingWorkItem`, new WorkItemDto());
            expect(store.getters[`${workItemKey}/pendingWorkItem`]).toBeTruthy();

            const result = await store.dispatch(`${workItemKey}/createWorkItem`);

            sinonExpect.calledOnce(workItemHttpStub.createWorkItem);
            expect(store.getters[`${workItemKey}/pendingWorkItem`]).toBeNull();
            expect(result).toEqual('1234567890');
        });
    });

    describe('updateWorkItem', () => {
        test('should do nothing and return false when update failed', async() => {
            workItemHttpStub.updateWorkItem.resolves(null);

            const result = await store.dispatch(`${workItemKey}/updateWorkItem`, new WorkItem());

            sinonExpect.calledOnce(workItemHttpStub.updateWorkItem);
            sinonExpect.notCalled(workItemHttpStub.getWorkItemMeta);
            expect(result).toBeFalsy();
        });

        test('should return true on update success', async() => {
            const edited: WorkItem = { ...new WorkItem(), id: '2', name: 'edited_name' };
            const toUpdate: WorkItem = { ...new WorkItem(), id: '1', name: 'updated_name' };
            const updated: WorkItemDto = { ...new WorkItemDto(), id: toUpdate.id, name: toUpdate.name };
            workItemHttpStub.updateWorkItem.resolves(toUpdate);
            workItemHttpStub.getWorkItemMeta.resolves(updated);
            store.commit(`${workItemKey}/setWorkItems`, [{ ...new WorkItemDto(), id: toUpdate.id, name: 'previous_name' }]);
            store.commit(`${workItemKey}/setEditedWorkItem`, edited);

            const result = await store.dispatch(`${workItemKey}/updateWorkItem`, toUpdate);

            sinonExpect.calledOnce(workItemHttpStub.updateWorkItem);
            sinonExpect.calledOnce(workItemHttpStub.getWorkItemMeta);
            expect(store.getters[`${workItemKey}/workItems`][0]).toEqual(updated);
            expect(store.getters[`${workItemKey}/editedWorkItem`]).toEqual(edited);
            expect(result).toBeTruthy();
        });

        test('should return true and reload work item content when applicable on update success', async() => {
            const toUpdate: WorkItem = { ...new WorkItem(), id: '1', name: 'updated_name' };
            const updated: WorkItemDto = { ...new WorkItemDto(), id: toUpdate.id, name: toUpdate.name };
            workItemHttpStub.updateWorkItem.resolves(toUpdate);
            workItemHttpStub.getWorkItemMeta.resolves(updated);
            store.commit(`${workItemKey}/setWorkItems`, [{ ...new WorkItemDto(), id: toUpdate.id, name: 'previous_name' }]);
            store.commit(`${workItemKey}/setEditedWorkItem`, toUpdate);

            const result = await store.dispatch(`${workItemKey}/updateWorkItem`, toUpdate);

            sinonExpect.calledOnce(workItemHttpStub.updateWorkItem);
            sinonExpect.calledOnce(workItemHttpStub.getWorkItemMeta);
            expect(store.getters[`${workItemKey}/workItems`][0]).toEqual(updated);
            expect(store.getters[`${workItemKey}/editedWorkItem`]).toEqual(toUpdate);
            expect(result).toBeTruthy();
        });
    });

    describe('deleteWorkItem', () => {
        beforeEach(() => {
            store.commit(`${workItemKey}/setWorkItems`, [{ ...new WorkItemDto(), id: '1' }]);
            store.commit(`${workItemKey}/setEditedWorkItem`, { ...new WorkItem(), id: '1' });
        });

        test('should do nothing and return false when delete failed', async() => {
            workItemHttpStub.deleteWorkItem.resolves(false);

            const result = await store.dispatch(`${workItemKey}/deleteWorkItem`, '1');

            sinonExpect.calledOnce(workItemHttpStub.deleteWorkItem);
            expect(store.getters[`${workItemKey}/workItems`].length).toEqual(1);
            expect(store.getters[`${workItemKey}/workItems`][0].id).toEqual('1');
            expect(store.getters[`${workItemKey}/editedWorkItem`].id).toEqual('1');
            expect(result).toBeFalsy();
        });

        test('should return true on delete success', async() => {
            workItemHttpStub.deleteWorkItem.resolves(true);
            store.commit(`${workItemKey}/setEditedWorkItem`, { ...new WorkItem(), id: '2' });

            const result = await store.dispatch(`${workItemKey}/deleteWorkItem`, '1');

            sinonExpect.calledOnce(workItemHttpStub.deleteWorkItem);
            expect(store.getters[`${workItemKey}/workItems`].length).toEqual(0);
            expect(store.getters[`${workItemKey}/editedWorkItem`]).not.toBeNull();
            expect(result).toBeTruthy();
        });

        test('should return true and remove work item content when applicable on delete success', async() => {
            workItemHttpStub.deleteWorkItem.resolves(true);

            const result = await store.dispatch(`${workItemKey}/deleteWorkItem`, '1');

            sinonExpect.calledOnce(workItemHttpStub.deleteWorkItem);
            expect(store.getters[`${workItemKey}/workItems`].length).toEqual(0);
            expect(store.getters[`${workItemKey}/editedWorkItem`]).toBeNull();
            expect(result).toBeTruthy();
        });
    });

    describe('startWorkItem', () => {
        test('should do nothing when failed to start work item', async() => {
            workItemHttpStub.startWorkItem.resolves(false);

            await store.dispatch(`${workItemKey}/startWorkItem`, '1');

            sinonExpect.calledOnce(workItemHttpStub.startWorkItem);
            sinonExpect.notCalled(workItemHttpStub.getWorkItems);
        });

        test('should reload work items when successfully started work item', async() => {
            workItemHttpStub.startWorkItem.resolves(true);

            await store.dispatch(`${workItemKey}/startWorkItem`, '1');

            sinonExpect.calledOnce(workItemHttpStub.startWorkItem);
            sinonExpect.calledOnce(workItemHttpStub.getWorkItems);
        });
    });

    describe('stopWorkItem', () => {
        test('should do nothing when failed to stop work item', async() => {
            workItemHttpStub.stopWorkItem.resolves(false);

            await store.dispatch(`${workItemKey}/stopWorkItem`, '1');

            sinonExpect.calledOnce(workItemHttpStub.stopWorkItem);
            sinonExpect.notCalled(workItemHttpStub.getWorkItems);
        });

        test('should reload work items when successfully stopped work item', async() => {
            workItemHttpStub.stopWorkItem.resolves(true);

            await store.dispatch(`${workItemKey}/stopWorkItem`, '1');

            sinonExpect.calledOnce(workItemHttpStub.stopWorkItem);
            sinonExpect.calledOnce(workItemHttpStub.getWorkItems);
        });
    });

    describe('updateWorkItemMeta', () => {
        beforeEach(() => {
            store.commit(`${workItemKey}/setWorkItems`, [{ ...new WorkItemDto(), id: '1', name: 'previous_name' }]);
        });

        test('should return false when failed to update work item meta', async() => {
            workItemHttpStub.updateWorkItemMeta.resolves(null);

            const result = await store.dispatch(`${workItemKey}/updateWorkItemMeta`, new WorkItemDto());

            sinonExpect.calledOnce(workItemHttpStub.updateWorkItemMeta);
            expect(store.getters[`${workItemKey}/workItems`][0].name).toEqual('previous_name');
            expect(result).toBeFalsy();
        });

        test('should return true and reload work item content when updated successfully', async() => {
            workItemHttpStub.updateWorkItemMeta.resolves({ ...new WorkItemDto(), id: '1', name: 'updated_name' });

            const result = await store.dispatch(`${workItemKey}/updateWorkItemMeta`, new WorkItemDto());

            sinonExpect.calledOnce(workItemHttpStub.updateWorkItemMeta);
            expect(store.getters[`${workItemKey}/workItems`][0].name).toEqual('updated_name');
            expect(result).toBeTruthy();
        });
    });

    describe('loadEditedWorkItem', () => {
        test('should load edited work item', async() => {
            const item: WorkItem = { ...new WorkItem(), id: '1' };
            workItemHttpStub.getWorkItem.resolves(item);
            expect(store.getters[`${workItemKey}/editedWorkItem`]).not.toEqual(item);

            await store.dispatch(`${workItemKey}/loadEditedWorkItem`, '1');

            sinonExpect.calledOnce(workItemHttpStub.getWorkItem);
            expect(store.getters[`${workItemKey}/editedWorkItem`]).toEqual(item);
        });
    });

    describe('loadWorkItems', () => {
        test('should load work items and cache most recent query', async() => {
            const query: WorkItemQuery = { ...new WorkItemQuery(), searchText: 'search_text' };
            const items: WorkItemDto[] = [{ ...new WorkItemDto(), id: '1' }];
            workItemHttpStub.getWorkItems.resolves(items);
            expect(store.state.lastQuery).not.toEqual(query);

            await store.dispatch(`${workItemKey}/loadWorkItems`, query);

            sinonExpect.calledOnce(workItemHttpStub.getWorkItems);
            expect(store.state[workItemKey].lastQuery).toEqual(query);
            expect(store.getters[`${workItemKey}/workItems`]).toEqual(items);
        });
    });
});
