import axios from 'axios';
import { assert as sinonExpect, SinonStub, stub } from 'sinon';

import { types } from '../../../ioc/types';
import { container } from '../../../ioc/container';
import { WorkItemDto } from '../../../dtos/work-item-dto';
import { WorkItem } from '../../../models/work-item/work-item';
import { WorkItemQuery } from '../../../models/work-item/work-item-query';

import { WorkItemHttpService } from './work-item-http.service';

describe('work item http service unit test', () => {
    let service: WorkItemHttpService;
    let getStub: SinonStub;
    let postStub: SinonStub;
    let putStub: SinonStub;
    let deleteStub: SinonStub;

    beforeEach(() => {
        service = container.get<WorkItemHttpService>(types.WorkItemHttpService);
        getStub = stub(axios, 'get');
        postStub = stub(axios, 'post');
        putStub = stub(axios, 'put');
        deleteStub = stub(axios, 'delete');
    });

    afterEach(() => {
        getStub.restore();
        postStub.restore();
        putStub.restore();
        deleteStub.restore();
    });

    test('should resolve service', () => {
        expect(service).toBeTruthy();
    });

    describe('createWorkItem', () => {
        test('should call correct endpoint', async() => {
            const item = new WorkItemDto();

            await service.createWorkItem(item);

            sinonExpect.calledOnceWithExactly(postStub, 'api/v1/work-items', item);
        });

        test('should return null on error', async() => {
            getStub.throws(new Error());

            expect(await service.createWorkItem(new WorkItemDto())).toBeNull();
        });
    });

    describe('getWorkItem', () => {
        test('should call correct endpoint', async() => {
            await service.getWorkItem('12345');

            sinonExpect.calledOnceWithExactly(getStub, 'api/v1/work-items/12345');
        });

        test('should return null on error', async() => {
            getStub.throws(new Error());

            expect(await service.getWorkItem('12345')).toBeNull();
        });
    });

    describe('updateWorkItem', () => {
        test('should call correct endpoint', async() => {
            const item = new WorkItem();

            await service.updateWorkItem(item);

            sinonExpect.calledOnceWithExactly(putStub, 'api/v1/work-items', item);
        });

        test('should return null on error', async() => {
            getStub.throws(new Error());

            expect(await service.updateWorkItem(new WorkItem())).toBeNull();
        });
    });

    describe('deleteWorkItem', () => {
        test('should call correct endpoint', async() => {
            await service.deleteWorkItem('12345');

            sinonExpect.calledOnceWithExactly(deleteStub, 'api/v1/work-items/12345');
        });

        test('should return false on error', async() => {
            getStub.throws(new Error());

            expect(await service.deleteWorkItem('12345')).toBeFalsy();
        });
    });

    describe('stopWorkItem', () => {
        test('should call correct endpoint', async() => {
            await service.stopWorkItem();

            sinonExpect.calledOnceWithExactly(postStub, 'api/v1/work-items/stop?status=1');
        });

        test('should return false on error', async() => {
            getStub.throws(new Error());

            expect(await service.stopWorkItem()).toBeFalsy();
        });
    });

    describe('getWorkItemMeta', () => {
        test('should call correct endpoint', async() => {
            await service.getWorkItemMeta('12345');

            sinonExpect.calledOnceWithExactly(getStub, 'api/v1/work-items/12345/meta');
        });

        test('should return null on error', async() => {
            getStub.throws(new Error());

            expect(await service.getWorkItemMeta('12345')).toBeNull();
        });
    });

    describe('getWorkItems', () => {
        test('should call correct endpoint', async() => {
            const query = new WorkItemQuery();

            await service.getWorkItems(query);

            sinonExpect.calledOnceWithExactly(postStub, 'api/v1/work-items/summaries', query);
        });

        test('should return empty collection on error', async() => {
            getStub.throws(new Error());

            expect(await service.getWorkItems(new WorkItemQuery())).toEqual([]);
        });
    });

    describe('updateWorkItemMeta', () => {
        test('should call correct endpoint', async() => {
            const item = new WorkItemDto();

            await service.updateWorkItemMeta(item);

            sinonExpect.calledOnceWithExactly(putStub, 'api/v1/work-items/meta', item);
        });

        test('should return null on error', async() => {
            getStub.throws(new Error());

            expect(await service.updateWorkItemMeta(new WorkItemDto())).toBeNull();
        });
    });
});
