import { shallowMount, VueWrapper } from '@vue/test-utils';
import { assert as sinonExpect, createStubInstance, SinonStubbedInstance } from 'sinon';
import { createStore, Store } from 'vuex';

import { createStore as createTimeSessionStore, timeSessionKey } from '../../store/time-session/time-session.state';
import { createStore as createWorkItemStore, workItemKey } from '../../store/work-item/work-item.state';
import { types } from '../../core/ioc/types';
import { container } from '../../core/ioc/container';
import { FocusSessionDto } from '../../core/dtos/focus-session-dto';
import { WorkItemDto } from '../../core/dtos/work-item-dto';
import { FocusSessionStartupOption } from '../../core/models/time-session/focus-session-startup-option';
import { FocusSessionStopOption } from '../../core/models/time-session/focus-session-stop-option';
import { BreakSession } from '../../core/models/time-session/break-session';
import { WorkItem } from '../../core/models/work-item/work-item';
import { WorkItemStatus } from '../../core/enums/work-item-status.enum';
import { TimeSessionHttpService } from '../../core/services/http/time-session-http/time-session-http.service';
import { WorkItemHttpService } from '../../core/services/http/work-item-http/work-item-http.service';

import WorkItemsManagement from './work-items-management.vue';

describe('work items management unit test', () => {
    let component: VueWrapper<any>;
    let store: Store<any>;
    let timeSessionHttpStub: SinonStubbedInstance<TimeSessionHttpService>;
    let workItemHttpStub: SinonStubbedInstance<WorkItemHttpService>;

    beforeEach(() => {
        timeSessionHttpStub = createStubInstance(TimeSessionHttpService);
        workItemHttpStub = createStubInstance(WorkItemHttpService);
        workItemHttpStub.getWorkItems.resolves([]);

        container
            .rebind<TimeSessionHttpService>(types.TimeSessionHttpService)
            .toConstantValue(timeSessionHttpStub as unknown as TimeSessionHttpService);

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

    describe('showSessionStopDialog', () => {
        test('should set correct value when no active session exists', () => {
            store.commit(`${timeSessionKey}/setActiveFocusSession`, null);
            store.commit(`${timeSessionKey}/setActiveBreakSession`, null);

            component.vm.showSessionStopDialog();

            expect(component.vm.showStopFocusSessionDialog).toBeFalsy();
            expect(component.vm.showStopBreakSessionDialog).toBeFalsy();
        });

        test('should set correct value when active focus session exists', () => {
            store.commit(`${timeSessionKey}/setActiveFocusSession`, new FocusSessionDto());
            store.commit(`${timeSessionKey}/setActiveBreakSession`, null);

            component.vm.showSessionStopDialog();

            expect(component.vm.showStopFocusSessionDialog).toBeTruthy();
            expect(component.vm.showStopBreakSessionDialog).toBeFalsy();
        });

        test('should set correct value when active break session exists', () => {
            store.commit(`${timeSessionKey}/setActiveFocusSession`, null);
            store.commit(`${timeSessionKey}/setActiveBreakSession`, new BreakSession());

            component.vm.showSessionStopDialog();

            expect(component.vm.showStopFocusSessionDialog).toBeFalsy();
            expect(component.vm.showStopBreakSessionDialog).toBeTruthy();
        });
    });

    describe('onFocusSessionStart', () => {
        test('should not load work items when failed to start focus session', async() => {
            const option = new FocusSessionStartupOption(new WorkItemDto());
            timeSessionHttpStub.startFocusSession.resolves(false);
            component.vm.focusSessionOption = option;

            await component.vm.onFocusSessionStart(option);

            sinonExpect.calledOnce(timeSessionHttpStub.startFocusSession);
            sinonExpect.notCalled(workItemHttpStub.getWorkItems);
            expect(component.vm.focusSessionOption).toBeNull();
        });

        test('should load work items when successfully started focus session', async() => {
            const option = new FocusSessionStartupOption(new WorkItemDto());
            timeSessionHttpStub.startFocusSession.resolves(true);
            component.vm.focusSessionOption = option;

            await component.vm.onFocusSessionStart(option);

            sinonExpect.calledOnce(timeSessionHttpStub.startFocusSession);
            sinonExpect.calledOnce(workItemHttpStub.getWorkItems);
            expect(component.vm.focusSessionOption).toBeNull();
        });
    });

    describe('onFocusSessionEnd', () => {
        test('should not load work items and keep dialog open when failed to stop focus session', async() => {
            const option = new FocusSessionStopOption('1234', 0);
            timeSessionHttpStub.stopFocusSession.resolves(false);
            component.vm.showStopFocusSessionDialog = true;

            await component.vm.onFocusSessionEnd(option);

            sinonExpect.calledOnce(timeSessionHttpStub.stopFocusSession);
            sinonExpect.notCalled(timeSessionHttpStub.startBreakSession);
            sinonExpect.notCalled(workItemHttpStub.getWorkItems);
            expect(component.vm.showStopFocusSessionDialog).toBeTruthy();
        });

        test('should not load work items when failed to start break session', async() => {
            const option = new FocusSessionStopOption('1234', 5);
            timeSessionHttpStub.stopFocusSession.resolves(true);
            timeSessionHttpStub.startBreakSession.resolves(false);
            component.vm.showStopFocusSessionDialog = true;

            await component.vm.onFocusSessionEnd(option);

            sinonExpect.calledOnce(timeSessionHttpStub.stopFocusSession);
            sinonExpect.calledOnce(timeSessionHttpStub.startBreakSession);
            sinonExpect.notCalled(workItemHttpStub.getWorkItems);
            expect(component.vm.showStopFocusSessionDialog).toBeFalsy();
        });

        test('should load work items and close dialog when successfully stopped focus session and no break session needed', async() => {
            const option = new FocusSessionStopOption('1234', 0);
            timeSessionHttpStub.stopFocusSession.resolves(true);
            component.vm.showStopFocusSessionDialog = true;

            await component.vm.onFocusSessionEnd(option);

            sinonExpect.calledOnce(timeSessionHttpStub.stopFocusSession);
            sinonExpect.notCalled(timeSessionHttpStub.startBreakSession);
            sinonExpect.calledOnce(workItemHttpStub.getWorkItems);
            expect(component.vm.showStopFocusSessionDialog).toBeFalsy();
        });

        test('should load work items and close dialog when successfully stopped focus session and started break session', async() => {
            const option = new FocusSessionStopOption('1234', 5);
            timeSessionHttpStub.stopFocusSession.resolves(true);
            timeSessionHttpStub.startBreakSession.resolves(true);
            component.vm.showStopFocusSessionDialog = true;

            await component.vm.onFocusSessionEnd(option);

            sinonExpect.calledOnce(timeSessionHttpStub.stopFocusSession);
            sinonExpect.calledOnce(timeSessionHttpStub.startBreakSession);
            sinonExpect.calledOnce(workItemHttpStub.getWorkItems);
            expect(component.vm.showStopFocusSessionDialog).toBeFalsy();
        });
    });

    describe('onBreakSessionEnd', () => {
        test('should not load work items and keep dialog open when failed to stop break session', async() => {
            timeSessionHttpStub.stopBreakSession.resolves(false);
            component.vm.showStopBreakSessionDialog = true;

            await component.vm.onBreakSessionEnd('1234');

            sinonExpect.calledOnce(timeSessionHttpStub.stopBreakSession);
            sinonExpect.notCalled(workItemHttpStub.getWorkItems);
            expect(component.vm.showStopBreakSessionDialog).toBeTruthy();
        });

        test('should load work items and close dialog when successfully stopped break session', async() => {
            timeSessionHttpStub.stopBreakSession.resolves(true);
            component.vm.showStopBreakSessionDialog = true;

            await component.vm.onBreakSessionEnd('1234');

            sinonExpect.calledOnce(timeSessionHttpStub.stopBreakSession);
            sinonExpect.calledOnce(workItemHttpStub.getWorkItems);
            expect(component.vm.showStopBreakSessionDialog).toBeFalsy();
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
        test('should create focus session option when no active focus session exists', async() => {
            const item: WorkItemDto = { ...new WorkItemDto(), id: '12345' };
            store.commit(`${timeSessionKey}/setActiveFocusSession`, null);
            component.vm.focusSessionOption = null;

            await component.vm.onItemStart(item);

            sinonExpect.notCalled(workItemHttpStub.startWorkItem);
            expect(component.vm.focusSessionOption.startingItem).toEqual(item);
            expect(component.vm.focusSessionOption.totalMinutes).toEqual(25);
        });

        test('should not emit anything when failed to start work item', async() => {
            const item: WorkItemDto = { ...new WorkItemDto(), id: '12345' };
            workItemHttpStub.startWorkItem.resolves(false);
            store.commit(`${timeSessionKey}/setActiveFocusSession`, new FocusSessionDto());

            await component.vm.onItemStart(item);

            sinonExpect.calledOnce(workItemHttpStub.startWorkItem);
            expect(component.emitted()['item:update']).toBeFalsy();
        });

        test('should start work item and emit event when active focus session exists', async() => {
            const item: WorkItemDto = { ...new WorkItemDto(), id: '12345' };
            workItemHttpStub.startWorkItem.resolves(true);
            store.commit(`${timeSessionKey}/setActiveFocusSession`, new FocusSessionDto());

            await component.vm.onItemStart(item);

            sinonExpect.calledOnce(workItemHttpStub.startWorkItem);
            expect(component.emitted()['item:update'].length).toEqual(1);
        });
    });

    describe('onItemStop', () => {
        test('should not emit anything when failed to stop work item', async() => {
            workItemHttpStub.stopWorkItem.resolves(false);

            await component.vm.onItemStop(WorkItemStatus.Completed);

            sinonExpect.calledOnce(workItemHttpStub.stopWorkItem);
            expect(component.emitted()['item:update']).toBeFalsy();
        });

        test('should stop work item and emit event', async() => {
            workItemHttpStub.stopWorkItem.resolves(true);

            await component.vm.onItemStop(WorkItemStatus.Completed);

            sinonExpect.calledOnce(workItemHttpStub.stopWorkItem);
            expect(component.emitted()['item:update'].length).toEqual(1);
        });
    });
});
