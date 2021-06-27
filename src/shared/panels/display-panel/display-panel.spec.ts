import { shallowMount, VueWrapper } from '@vue/test-utils';

import DisplayPanel from './display-panel.vue';

describe('display panel unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(DisplayPanel);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('getHorizontalGuardStyle', () => {
        test('should return correct styles', async() => {
            await component.setProps({ corners: [true, false, true, false] });

            const styles = [0, 1, 2, 3].map(_ => component.vm.getHorizontalGuardStyle(_));

            expect(styles.every(_ => _.width === '0.5vh')).toBeTruthy();
            expect(styles.every(_ => _.height === '1px')).toBeTruthy();
            expect(styles[0].opacity).toEqual(1);
            expect(styles[1].opacity).toEqual(0);
            expect(styles[2].opacity).toEqual(1);
            expect(styles[3].opacity).toEqual(0);
        });
    });

    describe('getVerticalGuardStyle', () => {
        test('should return correct styles', async() => {
            await component.setProps({ corners: [false, true, false, true] });

            const styles = [0, 1, 2, 3].map(_ => component.vm.getVerticalGuardStyle(_));

            expect(styles.every(_ => _.width === '1px')).toBeTruthy();
            expect(styles.every(_ => _.height === '0.5vh')).toBeTruthy();
            expect(styles[0].opacity).toEqual(0);
            expect(styles[1].opacity).toEqual(1);
            expect(styles[2].opacity).toEqual(0);
            expect(styles[3].opacity).toEqual(1);
        });
    });
});
