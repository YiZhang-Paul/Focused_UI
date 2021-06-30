import axios from 'axios';
import { assert as sinonExpect, SinonStub, stub } from 'sinon';

import { types } from '../../../ioc/types';
import { container } from '../../../ioc/container';

import { TimeSessionHttpService } from './time-session-http.service';

describe('time session http service unit test', () => {
    let service: TimeSessionHttpService;
    let getStub: SinonStub;

    beforeEach(() => {
        service = container.get<TimeSessionHttpService>(types.TimeSessionHttpService);
        getStub = stub(axios, 'get');
    });

    afterEach(() => {
        getStub.restore();
    });

    test('should resolve service', () => {
        expect(service).toBeTruthy();
    });

    describe('getActiveFocusSessionMeta', () => {
        test('should call correct endpoint', async() => {
            await service.getActiveFocusSessionMeta();

            sinonExpect.calledOnceWithExactly(getStub, 'api/v1/time-session/active-focus-session/meta');
        });

        test('should return null on error', async() => {
            getStub.throws(new Error());

            expect(await service.getActiveFocusSessionMeta()).toBeNull();
        });
    });

    describe('getActiveBreakSession', () => {
        test('should call correct endpoint', async() => {
            await service.getActiveBreakSession();

            sinonExpect.calledOnceWithExactly(getStub, 'api/v1/time-session/active-break-session');
        });

        test('should return null on error', async() => {
            getStub.throws(new Error());

            expect(await service.getActiveBreakSession()).toBeNull();
        });
    });
});
