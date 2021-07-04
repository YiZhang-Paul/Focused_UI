import { IconUtility } from './icon-utility';

describe('icon utility unit test', () => {

    describe('getTimeIcon', () => {
        test('should return correct icon base on time', () => {
            expect(IconUtility.getTimeIcon(new Date(2021, 1, 1, 7)).name).toEqual('day');
            expect(IconUtility.getTimeIcon(new Date(2021, 1, 1, 8)).name).toEqual('day');
            expect(IconUtility.getTimeIcon(new Date(2021, 1, 1, 15)).name).toEqual('day');
            expect(IconUtility.getTimeIcon(new Date(2021, 1, 1, 16)).name).toEqual('day');

            expect(IconUtility.getTimeIcon(new Date(2021, 1, 1, 17)).name).toEqual('sunset');
            expect(IconUtility.getTimeIcon(new Date(2021, 1, 1, 18)).name).toEqual('sunset');
            expect(IconUtility.getTimeIcon(new Date(2021, 1, 1, 19)).name).toEqual('sunset');

            expect(IconUtility.getTimeIcon(new Date(2021, 1, 1, 20)).name).toEqual('night');
            expect(IconUtility.getTimeIcon(new Date(2021, 1, 1, 21)).name).toEqual('night');
            expect(IconUtility.getTimeIcon(new Date(2021, 1, 1, 1)).name).toEqual('night');
            expect(IconUtility.getTimeIcon(new Date(2021, 1, 1, 2)).name).toEqual('night');
        });
    });
});