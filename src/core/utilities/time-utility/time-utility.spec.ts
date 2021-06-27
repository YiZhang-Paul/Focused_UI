import { TimeUtility } from './time-utility';

describe('time utility unit test', () => {

    describe('isLeapYear', () => {
        test('should return false for non leap years', () => {
            const years = [1700, 1800, 1900, 2100];

            for (const year of years) {
                expect(TimeUtility.isLeapYear(year)).toBeFalsy();
            }
        });

        test('should return true for leap years', () => {
            const years = [1992, 2000, 2016, 2020, 2024];

            for (const year of years) {
                expect(TimeUtility.isLeapYear(year)).toBeTruthy();
            }
        });
    });

    describe('getMonthName', () => {
        test('should return empty string for invalid month', () => {
            expect(TimeUtility.getMonthName(-1)).toEqual('');
            expect(TimeUtility.getMonthName(12)).toEqual('');
        });

        test('should return correct month names', () => {
            expect(TimeUtility.getMonthName(0)).toEqual('January');
            expect(TimeUtility.getMonthName(1)).toEqual('February');
            expect(TimeUtility.getMonthName(2)).toEqual('March');
            expect(TimeUtility.getMonthName(3)).toEqual('April');
            expect(TimeUtility.getMonthName(4)).toEqual('May');
            expect(TimeUtility.getMonthName(5)).toEqual('June');
            expect(TimeUtility.getMonthName(6)).toEqual('July');
            expect(TimeUtility.getMonthName(7)).toEqual('August');
            expect(TimeUtility.getMonthName(8)).toEqual('September');
            expect(TimeUtility.getMonthName(9)).toEqual('October');
            expect(TimeUtility.getMonthName(10)).toEqual('November');
            expect(TimeUtility.getMonthName(11)).toEqual('December');
        });
    });

    describe('getDateSuffix', () => {
        test('should return correct suffix', () => {
            expect(TimeUtility.getDateSuffix(1)).toEqual('st');
            expect(TimeUtility.getDateSuffix(2)).toEqual('nd');
            expect(TimeUtility.getDateSuffix(3)).toEqual('rd');
            expect(TimeUtility.getDateSuffix(4)).toEqual('th');
            expect(TimeUtility.getDateSuffix(11)).toEqual('th');
            expect(TimeUtility.getDateSuffix(12)).toEqual('th');
            expect(TimeUtility.getDateSuffix(13)).toEqual('th');
            expect(TimeUtility.getDateSuffix(14)).toEqual('th');
            expect(TimeUtility.getDateSuffix(21)).toEqual('st');
            expect(TimeUtility.getDateSuffix(22)).toEqual('nd');
            expect(TimeUtility.getDateSuffix(23)).toEqual('rd');
            expect(TimeUtility.getDateSuffix(24)).toEqual('th');
            expect(TimeUtility.getDateSuffix(31)).toEqual('st');
        });
    });
});