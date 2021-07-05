import axios from 'axios';
import { assert as sinonExpect, SinonStub, stub } from 'sinon';

import { types } from '../../../ioc/types';
import { container } from '../../../ioc/container';
import { WorkItemDto } from '../../../dtos/work-item-dto';
import { FocusSessionStartupOption } from '../../../models/time-session/focus-session-startup-option';
import { BreakSessionStartupOption } from '../../../models/time-session/break-session-startup-option';

import { TimeSessionHttpService } from './time-session-http.service';

describe('time session http service unit test', () => {
    let service: TimeSessionHttpService;
    let getStub: SinonStub;
    let postStub: SinonStub;

    beforeEach(() => {
        service = container.get<TimeSessionHttpService>(types.TimeSessionHttpService);
        getStub = stub(axios, 'get');
        postStub = stub(axios, 'post');
    });

    afterEach(() => {
        getStub.restore();
        postStub.restore();
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

    describe('getStaleFocusSessionMeta', () => {
        test('should call correct endpoint', async() => {
            await service.getStaleFocusSessionMeta();

            sinonExpect.calledOnceWithExactly(getStub, 'api/v1/time-session/stale-focus-session/meta');
        });

        test('should return null on error', async() => {
            getStub.throws(new Error());

            expect(await service.getStaleFocusSessionMeta()).toBeNull();
        });
    });

    describe('startFocusSession', () => {
        let option: FocusSessionStartupOption;

        beforeEach(() => {
            option = new FocusSessionStartupOption(new WorkItemDto());
        });

        test('should call correct endpoint', async() => {
            await service.startFocusSession(option);

            sinonExpect.calledOnceWithExactly(postStub, 'api/v1/time-session/focus-session/start', option);
        });

        test('should return false on error', async() => {
            postStub.throws(new Error());

            expect(await service.startFocusSession(option)).toBeFalsy();
        });
    });

    describe('stopFocusSession', () => {
        test('should call correct endpoint', async() => {
            await service.stopFocusSession('1234');

            sinonExpect.calledOnceWithExactly(postStub, 'api/v1/time-session/focus-session/1234/stop');
        });

        test('should return false on error', async() => {
            postStub.throws(new Error());

            expect(await service.stopFocusSession('1234')).toBeFalsy();
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

    describe('getStaleBreakSession', () => {
        test('should call correct endpoint', async() => {
            await service.getStaleBreakSession();

            sinonExpect.calledOnceWithExactly(getStub, 'api/v1/time-session/stale-break-session');
        });

        test('should return null on error', async() => {
            getStub.throws(new Error());

            expect(await service.getStaleBreakSession()).toBeNull();
        });
    });

    describe('startBreakSession', () => {
        let option: BreakSessionStartupOption;

        beforeEach(() => {
            option = new BreakSessionStartupOption('1234', 5);
        });

        test('should call correct endpoint', async() => {
            await service.startBreakSession(option);

            sinonExpect.calledOnceWithExactly(postStub, 'api/v1/time-session/break-session/start', option);
        });

        test('should return false on error', async() => {
            postStub.throws(new Error());

            expect(await service.startBreakSession(option)).toBeFalsy();
        });
    });

    describe('stopBreakSession', () => {
        test('should call correct endpoint', async() => {
            await service.stopBreakSession('1234');

            sinonExpect.calledOnceWithExactly(postStub, 'api/v1/time-session/break-session/1234/stop');
        });

        test('should return false on error', async() => {
            postStub.throws(new Error());

            expect(await service.stopBreakSession('1234')).toBeFalsy();
        });
    });
});
