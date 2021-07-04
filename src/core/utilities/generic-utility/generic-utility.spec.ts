import { GenericUtility } from './generic-utility';

describe('generic utility unit test', () => {

    describe('replaceAt', () => {
        test('should return original elements when index is invalid', () => {
            expect(GenericUtility.replaceAt([1, 2, 3], 9, -1)).toEqual([1, 2, 3]);
            expect(GenericUtility.replaceAt([1, 2, 3], 9, 3)).toEqual([1, 2, 3]);
        });

        test('should replace element', () => {
            expect(GenericUtility.replaceAt([1, 2, 3], 9, 1)).toEqual([1, 9, 3]);
        });
    });

    describe('removeAt', () => {
        test('should return original elements when index is invalid', () => {
            expect(GenericUtility.removeAt([1, 2, 3], -1)).toEqual([1, 2, 3]);
            expect(GenericUtility.removeAt([1, 2, 3], 3)).toEqual([1, 2, 3]);
        });

        test('should remove element', () => {
            expect(GenericUtility.removeAt([1, 2, 3], 1)).toEqual([1, 3]);
        });
    });

    describe('sum', () => {
        test('should return sum of values', () => {
            const elements = [{ value: 1 }, { value: 5 }, { value: 9 }, { value: 2 }];

            expect(GenericUtility.sum(elements, _ => _.value)).toEqual(17);
        });
    });

    describe('roundTo', () => {
        test('should return rounded value', () => {
            expect(GenericUtility.roundTo(5)).toEqual(5);
            expect(GenericUtility.roundTo(5.1, )).toEqual(5);
            expect(GenericUtility.roundTo(5.5)).toEqual(6);
            expect(GenericUtility.roundTo(5.5, 1)).toEqual(5.5);
            expect(GenericUtility.roundTo(5.55, 1)).toEqual(5.6);
        });
    });
});