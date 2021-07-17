import { assert as sinonExpect, createStubInstance, SinonStubbedInstance } from 'sinon';

import { createStore } from '../../store';
import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { WorkItemDto } from '../../core/dtos/work-item-dto';
import { WorkItem } from '../../core/models/work-item/work-item';
import { WorkItemQuery } from '../../core/models/work-item/work-item-query';
import { WorkItemPriority } from '../../core/enums/work-item-priority.enum';
import { WorkItemType } from '../../core/enums/work-item-type.enum';
import { WorkItemHttpService } from '../../core/services/http/work-item-http/work-item-http.service';

describe('work item store unit test', () => {
    let store: ReturnType<typeof createStore>;
    let workItemHttpStub: SinonStubbedInstance<WorkItemHttpService>;

    beforeEach(() => {
        workItemHttpStub = createStubInstance(WorkItemHttpService);
        workItemHttpStub.getWorkItems.resolves([]);

        container
            .rebind<WorkItemHttpService>(types.WorkItemHttpService)
            .toConstantValue(workItemHttpStub as unknown as WorkItemHttpService);

        store = createStore();
    });

    describe('editedWorkItemMeta', () => {
        test('should return null when no edited work item exists', () => {
            store.workItem.commit(store.store, store.workItem.keys.mutations.SetEditedWorkItem, null);

            expect(store.workItem.getters(store.store, store.workItem.keys.getters.EditedWorkItemMeta)).toBeNull();
        });

        test('should return null when edited work item does not exist in work items list', () => {
            const items: WorkItemDto[] = [
                { ...new WorkItemDto(), id: '2' },
                { ...new WorkItemDto(), id: '3' }
            ];

            store.workItem.commit(store.store, store.workItem.keys.mutations.SetEditedWorkItem, { ...new WorkItem(), id: '1' });
            store.workItem.commit(store.store, store.workItem.keys.mutations.SetWorkItems, items);

            expect(store.workItem.getters(store.store, store.workItem.keys.getters.EditedWorkItemMeta)).toBeNull();
        });

        test('should return edited work item meta', () => {
            const items: WorkItemDto[] = [
                { ...new WorkItemDto(), id: '1' },
                { ...new WorkItemDto(), id: '2' }
            ];

            store.workItem.commit(store.store, store.workItem.keys.mutations.SetEditedWorkItem, { ...new WorkItem(), id: '2' });
            store.workItem.commit(store.store, store.workItem.keys.mutations.SetWorkItems, items);

            expect(store.workItem.getters(store.store, store.workItem.keys.getters.EditedWorkItemMeta)?.id).toEqual('2');
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

            store.workItem.commit(store.store, store.workItem.keys.mutations.SetWorkItems, unsorted);

            expect(store.workItem.getters(store.store, store.workItem.keys.getters.WorkItems)).toEqual(sorted);
        });
    });

    describe('createWorkItem', () => {
        test('should do nothing when no pending work item exists', async() => {
            store.workItem.commit(store.store, store.workItem.keys.mutations.SetPendingWorkItem, null);

            const result = await store.workItem.dispatch(store.store, store.workItem.keys.actions.CreateWorkItem);

            sinonExpect.notCalled(workItemHttpStub.createWorkItem);
            expect(result).toBeNull();
        });

        test('should return null when failed to create work item', async() => {
            workItemHttpStub.createWorkItem.resolves(null);
            store.workItem.commit(store.store, store.workItem.keys.mutations.SetPendingWorkItem, new WorkItemDto());
            expect(store.workItem.getters(store.store, store.workItem.keys.getters.PendingWorkItem)).toBeTruthy();

            const result = await store.workItem.dispatch(store.store, store.workItem.keys.actions.CreateWorkItem);

            sinonExpect.calledOnce(workItemHttpStub.createWorkItem);
            expect(store.workItem.getters(store.store, store.workItem.keys.getters.PendingWorkItem)).toBeTruthy();
            expect(result).toBeNull();
        });

        test('should return work item id and clear pending work item on creation success', async() => {
            workItemHttpStub.createWorkItem.resolves('1234567890');
            store.workItem.commit(store.store, store.workItem.keys.mutations.SetPendingWorkItem, new WorkItemDto());
            expect(store.workItem.getters(store.store, store.workItem.keys.getters.PendingWorkItem)).toBeTruthy();

            const result = await store.workItem.dispatch(store.store, store.workItem.keys.actions.CreateWorkItem);

            sinonExpect.calledOnce(workItemHttpStub.createWorkItem);
            expect(store.workItem.getters(store.store, store.workItem.keys.getters.PendingWorkItem)).toBeNull();
            expect(result).toEqual('1234567890');
        });
    });

    describe('updateWorkItem', () => {
        test('should do nothing and return false when update failed', async() => {
            workItemHttpStub.updateWorkItem.resolves(null);

            const result = await store.workItem.dispatch(store.store, store.workItem.keys.actions.UpdateWorkItem, new WorkItem());

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
            store.workItem.commit(store.store, store.workItem.keys.mutations.SetWorkItems, [{ ...new WorkItemDto(), id: toUpdate.id, name: 'previous_name' }]);
            store.workItem.commit(store.store, store.workItem.keys.mutations.SetEditedWorkItem, edited);

            const result = await store.workItem.dispatch(store.store, store.workItem.keys.actions.UpdateWorkItem, toUpdate);

            sinonExpect.calledOnce(workItemHttpStub.updateWorkItem);
            sinonExpect.calledOnce(workItemHttpStub.getWorkItemMeta);
            expect(store.workItem.getters(store.store, store.workItem.keys.getters.WorkItems)[0]).toEqual(updated);
            expect(store.workItem.getters(store.store, store.workItem.keys.getters.EditedWorkItem)).toEqual(edited);
            expect(result).toBeTruthy();
        });

        test('should return true and reload work item content when applicable on update success', async() => {
            const toUpdate: WorkItem = { ...new WorkItem(), id: '1', name: 'updated_name' };
            const updated: WorkItemDto = { ...new WorkItemDto(), id: toUpdate.id, name: toUpdate.name };
            workItemHttpStub.updateWorkItem.resolves(toUpdate);
            workItemHttpStub.getWorkItemMeta.resolves(updated);
            store.workItem.commit(store.store, store.workItem.keys.mutations.SetWorkItems, [{ ...new WorkItemDto(), id: toUpdate.id, name: 'previous_name' }]);
            store.workItem.commit(store.store, store.workItem.keys.mutations.SetEditedWorkItem, toUpdate);

            const result = await store.workItem.dispatch(store.store, store.workItem.keys.actions.UpdateWorkItem, toUpdate);

            sinonExpect.calledOnce(workItemHttpStub.updateWorkItem);
            sinonExpect.calledOnce(workItemHttpStub.getWorkItemMeta);
            expect(store.workItem.getters(store.store, store.workItem.keys.getters.WorkItems)[0]).toEqual(updated);
            expect(store.workItem.getters(store.store, store.workItem.keys.getters.EditedWorkItem)).toEqual(toUpdate);
            expect(result).toBeTruthy();
        });
    });

    describe('deleteWorkItem', () => {
        beforeEach(() => {
            store.workItem.commit(store.store, store.workItem.keys.mutations.SetWorkItems, [{ ...new WorkItemDto(), id: '1' }]);
            store.workItem.commit(store.store, store.workItem.keys.mutations.SetEditedWorkItem, { ...new WorkItem(), id: '1' });
        });

        test('should do nothing and return false when delete failed', async() => {
            workItemHttpStub.deleteWorkItem.resolves(false);

            const result = await store.workItem.dispatch(store.store, store.workItem.keys.actions.DeleteWorkItem, '1');

            sinonExpect.calledOnce(workItemHttpStub.deleteWorkItem);
            expect(store.workItem.getters(store.store, store.workItem.keys.getters.WorkItems).length).toEqual(1);
            expect(store.workItem.getters(store.store, store.workItem.keys.getters.WorkItems)[0].id).toEqual('1');
            expect(store.workItem.getters(store.store, store.workItem.keys.getters.EditedWorkItem)?.id).toEqual('1');
            expect(result).toBeFalsy();
        });

        test('should return true on delete success', async() => {
            workItemHttpStub.deleteWorkItem.resolves(true);
            store.workItem.commit(store.store, store.workItem.keys.mutations.SetEditedWorkItem, { ...new WorkItem(), id: '2' });

            const result = await store.workItem.dispatch(store.store, store.workItem.keys.actions.DeleteWorkItem, '1');

            sinonExpect.calledOnce(workItemHttpStub.deleteWorkItem);
            expect(store.workItem.getters(store.store, store.workItem.keys.getters.WorkItems).length).toEqual(0);
            expect(store.workItem.getters(store.store, store.workItem.keys.getters.EditedWorkItem)).not.toBeNull();
            expect(result).toBeTruthy();
        });

        test('should return true and remove work item content when applicable on delete success', async() => {
            workItemHttpStub.deleteWorkItem.resolves(true);

            const result = await store.workItem.dispatch(store.store, store.workItem.keys.actions.DeleteWorkItem, '1');

            sinonExpect.calledOnce(workItemHttpStub.deleteWorkItem);
            expect(store.workItem.getters(store.store, store.workItem.keys.getters.WorkItems).length).toEqual(0);
            expect(store.workItem.getters(store.store, store.workItem.keys.getters.EditedWorkItem)).toBeNull();
            expect(result).toBeTruthy();
        });
    });

    describe('updateWorkItemMeta', () => {
        beforeEach(() => {
            store.workItem.commit(store.store, store.workItem.keys.mutations.SetWorkItems, [{ ...new WorkItemDto(), id: '1', name: 'previous_name' }]);
        });

        test('should return false when failed to update work item meta', async() => {
            workItemHttpStub.updateWorkItemMeta.resolves(null);

            const result = await store.workItem.dispatch(store.store, store.workItem.keys.actions.UpdateWorkItemMeta, new WorkItemDto());

            sinonExpect.calledOnce(workItemHttpStub.updateWorkItemMeta);
            expect(store.workItem.getters(store.store, store.workItem.keys.getters.WorkItems)[0].name).toEqual('previous_name');
            expect(result).toBeFalsy();
        });

        test('should return true and reload work item content when updated successfully', async() => {
            workItemHttpStub.updateWorkItemMeta.resolves({ ...new WorkItemDto(), id: '1', name: 'updated_name' });

            const result = await store.workItem.dispatch(store.store, store.workItem.keys.actions.UpdateWorkItemMeta, new WorkItemDto());

            sinonExpect.calledOnce(workItemHttpStub.updateWorkItemMeta);
            expect(store.workItem.getters(store.store, store.workItem.keys.getters.WorkItems)[0].name).toEqual('updated_name');
            expect(result).toBeTruthy();
        });
    });

    describe('loadEditedWorkItem', () => {
        test('should load edited work item', async() => {
            const item: WorkItem = { ...new WorkItem(), id: '1' };
            workItemHttpStub.getWorkItem.resolves(item);
            expect(store.workItem.getters(store.store, store.workItem.keys.getters.EditedWorkItem)).not.toEqual(item);

            await store.workItem.dispatch(store.store, store.workItem.keys.actions.LoadEditedWorkItem, '1');

            sinonExpect.calledOnce(workItemHttpStub.getWorkItem);
            expect(store.workItem.getters(store.store, store.workItem.keys.getters.EditedWorkItem)).toEqual(item);
        });
    });

    describe('loadWorkItems', () => {
        test('should use default query when not provided', async() => {
            expect(store.workItem.state(store.store).lastQuery).toBeFalsy();

            await store.workItem.dispatch(store.store, store.workItem.keys.actions.LoadWorkItems, null);

            expect(store.workItem.state(store.store).lastQuery).toBeTruthy();
        });

        test('should load work items and cache most recent query', async() => {
            const query: WorkItemQuery = { ...new WorkItemQuery(), searchText: 'search_text' };
            const items: WorkItemDto[] = [{ ...new WorkItemDto(), id: '1' }];
            workItemHttpStub.getWorkItems.resolves(items);
            expect(store.workItem.state(store.store).lastQuery).not.toEqual(query);

            await store.workItem.dispatch(store.store, store.workItem.keys.actions.LoadWorkItems, query);

            sinonExpect.calledOnce(workItemHttpStub.getWorkItems);
            expect(store.workItem.state(store.store).lastQuery).toEqual(query);
            expect(store.workItem.getters(store.store, store.workItem.keys.getters.WorkItems)).toEqual(items);
        });
    });
});
