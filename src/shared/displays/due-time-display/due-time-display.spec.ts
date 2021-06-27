import { shallowMount, VueWrapper } from '@vue/test-utils';

import DueTimeDisplay from './due-time-display.vue';

describe('due time display unit test', () => {
    const oneMinute = 60 * 1000;
    const oneHour = 60 * oneMinute;
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(DueTimeDisplay);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('dueTimeText', () => {
        test('should display nothing when due date does not exist or due in more than 24 hours', async() => {
            await component.setProps({ date: null });
            expect(component.vm.dueTimeText).toEqual('');

            await component.setProps({ date: new Date(Date.now() + 25 * oneHour).toISOString() });
            expect(component.vm.dueTimeText).toEqual('');
        });

        test('should display past due when applicable', async() => {
            await component.setProps({ date: new Date().toISOString() });
            expect(component.vm.dueTimeText).toEqual('past due');

            await component.setProps({ date: new Date(Date.now() - 1000).toISOString() });
            expect(component.vm.dueTimeText).toEqual('past due');
        });

        test('should display remaining hours when due in more than one hour', async() => {
            await component.setProps({ date: new Date(Date.now() + 3 * oneHour).toISOString() });
            expect(component.vm.dueTimeText).toEqual('due in 3 hours');

            await component.setProps({ date: new Date(Date.now() + oneHour).toISOString() });
            expect(component.vm.dueTimeText).toEqual('due in 1 hour');
        });

        test('should display remaining minutes when due in less than one hour', async() => {
            await component.setProps({ date: new Date(Date.now() + 30 * oneMinute).toISOString() });
            expect(component.vm.dueTimeText).toEqual('due in 30 minutes');

            await component.setProps({ date: new Date(Date.now() + oneMinute).toISOString() });
            expect(component.vm.dueTimeText).toEqual('due in 1 minute');
        });
    });
});