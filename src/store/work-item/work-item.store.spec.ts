import { createStore, Store } from 'vuex';
import { assert as sinonExpect, createStubInstance, SinonStubbedInstance } from 'sinon';

import { createStore as createTimeSessionStore, timeSessionKey } from '../time-session/time-session.store';
import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { WorkItemDto } from '../../core/dtos/work-item-dto';
import { WorkItem } from '../../core/models/work-item/work-item';
import { WorkItemQuery } from '../../core/models/work-item/work-item-query';
import { WorkItemPriority } from '../../core/enums/work-item-priority.enum';
import { WorkItemType } from '../../core/enums/work-item-type.enum';
import { WorkItemHttpService } from '../../core/services/http/work-item-http/work-item-http.service';

import { WorkItemGetter } from './work-item.getters';
import { WorkItemMutation } from './work-item.mutations';
import { WorkItemAction } from './work-item.actions';
import { createStore as createWorkItemStore, workItemCommit, workItemDispatch, workItemGetters, workItemKey, workItemState } from './work-item.store';

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
            workItemCommit(store, WorkItemMutation.SetEditedWorkItem, null);

            expect(workItemGetters(store, WorkItemGetter.EditedWorkItemMeta)).toBeNull();
        });

        test('should return null when edited work item does not exist in work items list', () => {
            const items: WorkItemDto[] = [
                { ...new WorkItemDto(), id: '2' },
                { ...new WorkItemDto(), id: '3' }
            ];

            workItemCommit(store, WorkItemMutation.SetEditedWorkItem, { ...new WorkItem(), id: '1' });
            workItemCommit(store, WorkItemMutation.SetWorkItems, items);

            expect(workItemGetters(store, WorkItemGetter.EditedWorkItemMeta)).toBeNull();
        });

        test('should return edited work item meta', () => {
            const items: WorkItemDto[] = [
                { ...new WorkItemDto(), id: '1' },
                { ...new WorkItemDto(), id: '2' }
            ];

            workItemCommit(store, WorkItemMutation.SetEditedWorkItem, { ...new WorkItem(), id: '2' });
            workItemCommit(store, WorkItemMutation.SetWorkItems, items);

            expect(workItemGetters(store, WorkItemGetter.EditedWorkItemMeta).id).toEqual('2');
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

            workItemCommit(store, WorkItemMutation.SetWorkItems, unsorted);

            expect(workItemGetters(store, WorkItemGetter.WorkItems)).toEqual(sorted);
        });
    });

    describe('createWorkItem', () => {
        test('should do nothing when no pending work item exists', async() => {
            workItemCommit(store, WorkItemMutation.SetPendingWorkItem, null);

            const result = await workItemDispatch(store, WorkItemAction.CreateWorkItem);

            sinonExpect.notCalled(workItemHttpStub.createWorkItem);
            expect(result).toBeNull();
        });

        test('should return null when failed to create work item', async() => {
            workItemHttpStub.createWorkItem.resolves(null);
            workItemCommit(store, WorkItemMutation.SetPendingWorkItem, new WorkItemDto());
            expect(workItemGetters(store, WorkItemGetter.PendingWorkItem)).toBeTruthy();

            const result = await workItemDispatch(store, WorkItemAction.CreateWorkItem);

            sinonExpect.calledOnce(workItemHttpStub.createWorkItem);
            expect(workItemGetters(store, WorkItemGetter.PendingWorkItem)).toBeTruthy();
            expect(result).toBeNull();
        });

        test('should return work item id and clear pending work item on creation success', async() => {
            workItemHttpStub.createWorkItem.resolves('1234567890');
            workItemCommit(store, WorkItemMutation.SetPendingWorkItem, new WorkItemDto());
            expect(workItemGetters(store, WorkItemGetter.PendingWorkItem)).toBeTruthy();

            const result = await workItemDispatch(store, WorkItemAction.CreateWorkItem);

            sinonExpect.calledOnce(workItemHttpStub.createWorkItem);
            expect(workItemGetters(store, WorkItemGetter.PendingWorkItem)).toBeNull();
            expect(result).toEqual('1234567890');
        });
    });

    describe('updateWorkItem', () => {
        test('should do nothing and return false when update failed', async() => {
            workItemHttpStub.updateWorkItem.resolves(null);

            const result = await workItemDispatch(store, WorkItemAction.UpdateWorkItem, new WorkItem());

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
            workItemCommit(store, WorkItemMutation.SetWorkItems, [{ ...new WorkItemDto(), id: toUpdate.id, name: 'previous_name' }]);
            workItemCommit(store, WorkItemMutation.SetEditedWorkItem, edited);

            const result = await workItemDispatch(store, WorkItemAction.UpdateWorkItem, toUpdate);

            sinonExpect.calledOnce(workItemHttpStub.updateWorkItem);
            sinonExpect.calledOnce(workItemHttpStub.getWorkItemMeta);
            expect(workItemGetters(store, WorkItemGetter.WorkItems)[0]).toEqual(updated);
            expect(workItemGetters(store, WorkItemGetter.EditedWorkItem)).toEqual(edited);
            expect(result).toBeTruthy();
        });

        test('should return true and reload work item content when applicable on update success', async() => {
            const toUpdate: WorkItem = { ...new WorkItem(), id: '1', name: 'updated_name' };
            const updated: WorkItemDto = { ...new WorkItemDto(), id: toUpdate.id, name: toUpdate.name };
            workItemHttpStub.updateWorkItem.resolves(toUpdate);
            workItemHttpStub.getWorkItemMeta.resolves(updated);
            workItemCommit(store, WorkItemMutation.SetWorkItems, [{ ...new WorkItemDto(), id: toUpdate.id, name: 'previous_name' }]);
            workItemCommit(store, WorkItemMutation.SetEditedWorkItem, toUpdate);

            const result = await workItemDispatch(store, WorkItemAction.UpdateWorkItem, toUpdate);

            sinonExpect.calledOnce(workItemHttpStub.updateWorkItem);
            sinonExpect.calledOnce(workItemHttpStub.getWorkItemMeta);
            expect(workItemGetters(store, WorkItemGetter.WorkItems)[0]).toEqual(updated);
            expect(workItemGetters(store, WorkItemGetter.EditedWorkItem)).toEqual(toUpdate);
            expect(result).toBeTruthy();
        });
    });

    describe('deleteWorkItem', () => {
        beforeEach(() => {
            workItemCommit(store, WorkItemMutation.SetWorkItems, [{ ...new WorkItemDto(), id: '1' }]);
            workItemCommit(store, WorkItemMutation.SetEditedWorkItem, { ...new WorkItem(), id: '1' });
        });

        test('should do nothing and return false when delete failed', async() => {
            workItemHttpStub.deleteWorkItem.resolves(false);

            const result = await workItemDispatch(store, WorkItemAction.DeleteWorkItem, '1');

            sinonExpect.calledOnce(workItemHttpStub.deleteWorkItem);
            expect(workItemGetters(store, WorkItemGetter.WorkItems).length).toEqual(1);
            expect(workItemGetters(store, WorkItemGetter.WorkItems)[0].id).toEqual('1');
            expect(workItemGetters(store, WorkItemGetter.EditedWorkItem).id).toEqual('1');
            expect(result).toBeFalsy();
        });

        test('should return true on delete success', async() => {
            workItemHttpStub.deleteWorkItem.resolves(true);
            workItemCommit(store, WorkItemMutation.SetEditedWorkItem, { ...new WorkItem(), id: '2' });

            const result = await workItemDispatch(store, WorkItemAction.DeleteWorkItem, '1');

            sinonExpect.calledOnce(workItemHttpStub.deleteWorkItem);
            expect(workItemGetters(store, WorkItemGetter.WorkItems).length).toEqual(0);
            expect(workItemGetters(store, WorkItemGetter.EditedWorkItem)).not.toBeNull();
            expect(result).toBeTruthy();
        });

        test('should return true and remove work item content when applicable on delete success', async() => {
            workItemHttpStub.deleteWorkItem.resolves(true);

            const result = await workItemDispatch(store, WorkItemAction.DeleteWorkItem, '1');

            sinonExpect.calledOnce(workItemHttpStub.deleteWorkItem);
            expect(workItemGetters(store, WorkItemGetter.WorkItems).length).toEqual(0);
            expect(workItemGetters(store, WorkItemGetter.EditedWorkItem)).toBeNull();
            expect(result).toBeTruthy();
        });
    });

    describe('updateWorkItemMeta', () => {
        beforeEach(() => {
            workItemCommit(store, WorkItemMutation.SetWorkItems, [{ ...new WorkItemDto(), id: '1', name: 'previous_name' }]);
        });

        test('should return false when failed to update work item meta', async() => {
            workItemHttpStub.updateWorkItemMeta.resolves(null);

            const result = await workItemDispatch(store, WorkItemAction.UpdateWorkItemMeta, new WorkItemDto());

            sinonExpect.calledOnce(workItemHttpStub.updateWorkItemMeta);
            expect(workItemGetters(store, WorkItemGetter.WorkItems)[0].name).toEqual('previous_name');
            expect(result).toBeFalsy();
        });

        test('should return true and reload work item content when updated successfully', async() => {
            workItemHttpStub.updateWorkItemMeta.resolves({ ...new WorkItemDto(), id: '1', name: 'updated_name' });

            const result = await workItemDispatch(store, WorkItemAction.UpdateWorkItemMeta, new WorkItemDto());

            sinonExpect.calledOnce(workItemHttpStub.updateWorkItemMeta);
            expect(workItemGetters(store, WorkItemGetter.WorkItems)[0].name).toEqual('updated_name');
            expect(result).toBeTruthy();
        });
    });

    describe('loadEditedWorkItem', () => {
        test('should load edited work item', async() => {
            const item: WorkItem = { ...new WorkItem(), id: '1' };
            workItemHttpStub.getWorkItem.resolves(item);
            expect(workItemGetters(store, WorkItemGetter.EditedWorkItem)).not.toEqual(item);

            await workItemDispatch(store, WorkItemAction.LoadEditedWorkItem, '1');

            sinonExpect.calledOnce(workItemHttpStub.getWorkItem);
            expect(workItemGetters(store, WorkItemGetter.EditedWorkItem)).toEqual(item);
        });
    });

    describe('loadWorkItems', () => {
        test('should use default query when not provided', async() => {
            expect(workItemState(store).lastQuery).toBeFalsy();

            await workItemDispatch(store, WorkItemAction.LoadWorkItems, null);

            expect(workItemState(store).lastQuery).toBeTruthy();
        });

        test('should load work items and cache most recent query', async() => {
            const query: WorkItemQuery = { ...new WorkItemQuery(), searchText: 'search_text' };
            const items: WorkItemDto[] = [{ ...new WorkItemDto(), id: '1' }];
            workItemHttpStub.getWorkItems.resolves(items);
            expect(workItemState(store).lastQuery).not.toEqual(query);

            await workItemDispatch(store, WorkItemAction.LoadWorkItems, query);

            sinonExpect.calledOnce(workItemHttpStub.getWorkItems);
            expect(workItemState(store).lastQuery).toEqual(query);
            expect(workItemGetters(store, WorkItemGetter.WorkItems)).toEqual(items);
        });
    });
});