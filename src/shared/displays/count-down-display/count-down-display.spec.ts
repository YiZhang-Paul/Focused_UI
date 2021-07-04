import { shallowMount, VueWrapper } from '@vue/test-utils';

import CountDownDisplay from './count-down-display.vue';

describe('count down display unit test', () => {
    const oneSecond = 1000;
    const oneMinute = oneSecond * 60;
    const oneHour = oneMinute * 60;
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(CountDownDisplay);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('hours', () => {
        test('should return remaining hours', async() => {
            await component.setProps({ target: null });
            expect(component.vm.hours).toEqual('00');

            await component.setProps({ target: new Date(Date.now() - oneHour) });
            expect(component.vm.hours).toEqual('00');

            await component.setProps({ target: new Date(Date.now() + oneHour * 15 + 59 * oneMinute) });
            expect(component.vm.hours).toEqual('15');

            await component.setProps({ target: new Date(Date.now() + oneHour * 5 + 59 * oneMinute) });
            expect(component.vm.hours).toEqual('05');
        });
    });

    describe('minutes', () => {
        test('should return remaining minutes', async() => {
            await component.setProps({ target: null });
            expect(component.vm.minutes).toEqual('00');

            await component.setProps({ target: new Date(Date.now() - oneHour) });
            expect(component.vm.minutes).toEqual('00');

            await component.setProps({ target: new Date(Date.now() + oneHour * 15 + 59 * oneMinute) });
            expect(component.vm.minutes).toEqual('59');

            await component.setProps({ target: new Date(Date.now() + oneHour * 5 + 5 * oneMinute) });
            expect(component.vm.minutes).toEqual('05');
        });
    });

    describe('seconds', () => {
        test('should return remaining seconds', async() => {
            await component.setProps({ target: null });
            expect(component.vm.seconds).toEqual('00');

            await component.setProps({ target: new Date(Date.now() - oneHour) });
            expect(component.vm.seconds).toEqual('00');

            await component.setProps({ target: new Date(Date.now() + 5 * oneMinute + 59 * oneSecond) });
            expect(component.vm.seconds).toEqual('59');

            await component.setProps({ target: new Date(Date.now() + 5 * oneMinute + 5 * oneSecond) });
            expect(component.vm.seconds).toEqual('05');
        });
    });
});
