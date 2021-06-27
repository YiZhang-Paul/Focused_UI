import { shallowMount, VueWrapper } from '@vue/test-utils';

import EstimationSelector from './estimation-selector.vue';

describe('estimation selector unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(EstimationSelector);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('onSelect', () => {
        let options: number[];

        beforeEach(() => {
            options = [2, 4, 6, 8];
        });

        test('should emit event and close options panel when option changed', async() => {
            await component.setProps({ modelValue: options[1] });
            component.vm.showOptions = true;

            component.vm.onSelect(options[0]);

            expect(component.emitted()['update:modelValue']).toBeTruthy();
            expect(component.emitted()['update:modelValue'].length).toEqual(1);
            expect(component.emitted()['update:modelValue'][0]).toEqual([options[0]]);
            expect(component.vm.showOptions).toBeFalsy();
        });

        test('should not emit event and close options panel when option is unchanged', async() => {
            await component.setProps({ modelValue: options[1] });
            component.vm.showOptions = true;

            component.vm.onSelect(options[1]);

            expect(component.emitted()['update:modelValue']).toBeFalsy();
            expect(component.vm.showOptions).toBeFalsy();
        });
    });
});
