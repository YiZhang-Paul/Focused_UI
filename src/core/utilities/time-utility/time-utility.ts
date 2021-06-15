const months = [
    'January', 'February', 'March',
    'April', 'May', 'June',
    'July', 'August', 'September',
    'October', 'November', 'December'
];

export class TimeUtility {

    public static isLeapYear(year: number): boolean {
        return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
    }

    public static getMonthName(index: number): string {
        return index < 0 || index > 11 ? '' : months[index];
    }

    public static getDateSuffix(date: number): string {
        const digits = String(date);

        if (digits !== '11' && digits.endsWith('1')) {
            return 'st';
        }

        if (digits !== '12' && digits.endsWith('2')) {
            return 'nd';
        }

        if (digits !== '13' && digits.endsWith('3')) {
            return 'rd';
        }

        return 'th';
    }
}
