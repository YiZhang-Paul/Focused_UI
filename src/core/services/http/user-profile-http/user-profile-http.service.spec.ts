import axios from 'axios';
import { assert as sinonExpect, SinonStub, stub } from 'sinon';

import { types } from '../../../ioc/types';
import { container } from '../../../ioc/container';
import { PerformanceRating } from '../../../models/user/performance-rating';

import { UserProfileHttpService } from './user-profile-http.service';

describe('user profile http service unit test', () => {
    let service: UserProfileHttpService;
    let getStub: SinonStub;
    let putStub: SinonStub;

    beforeEach(() => {
        service = container.get<UserProfileHttpService>(types.UserProfileHttpService);
        getStub = stub(axios, 'get');
        putStub = stub(axios, 'put');
    });

    afterEach(() => {
        getStub.restore();
        putStub.restore();
    });

    test('should resolve service', () => {
        expect(service).toBeTruthy();
    });

    describe('getUserProfile', () => {
        test('should call correct endpoint', async() => {
            await service.getUserProfile('12345');

            sinonExpect.calledOnceWithExactly(getStub, 'api/v1/user-profile/12345');
        });

        test('should return null on error', async() => {
            getStub.throws(new Error());

            expect(await service.getUserProfile('12345')).toBeNull();
        });
    });

    describe('updateUserRatings', () => {
        test('should call correct endpoint', async() => {
            const rating = new PerformanceRating();

            await service.updateUserRatings('12345', rating);

            sinonExpect.calledOnceWithExactly(putStub, 'api/v1/user-profile/12345/ratings', rating);
        });

        test('should return null on error', async() => {
            putStub.throws(new Error());

            expect(await service.updateUserRatings('12345', new PerformanceRating())).toBeNull();
        });
    });
});
