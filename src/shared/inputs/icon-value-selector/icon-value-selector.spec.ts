import { shallowMount, VueWrapper } from '@vue/test-utils';

import { IconSelectionOption } from '../../../core/models/generic/icon-selection-option';

import IconValueSelector from './icon-value-selector.vue';

describe('icon value selector unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(IconValueSelector);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('selectedOption', () => {
        let options: IconSelectionOption<number>[];

        beforeEach(() => {
            options = [
                { ...new IconSelectionOption<number>(), value: 2 },
                { ...new IconSelectionOption<number>(), value: 4 },
                { ...new IconSelectionOption<number>(), value: 6 }
            ]
        });

        test('should return null when no matching selection found', async() => {
            await component.setProps({ modelValue: 5, options });

            expect(component.vm.selectedOption).toBeNull();
        });

        test('should return null when no matching selection found', async() => {
            await component.setProps({ modelValue: 4, options });

            expect(component.vm.selectedOption).toEqual(options[1]);
        });
    });

    describe('getOptionStyle', () => {
        test('should return correct option style', () => {
            const style = component.vm.getOptionStyle({ ...new IconSelectionOption<number>(), colorType: 'color-type' });

            expect(style.color).toEqual('var(--color-type-00)');
        });
    });

    describe('onSelect', () => {
        let options: IconSelectionOption<number>[];

        beforeEach(() => {
            options = [
                { ...new IconSelectionOption<number>(), value: 2 },
                { ...new IconSelectionOption<number>(), value: 4 }
            ]
        });

        test('should emit event and close options panel when option changed', async() => {
            await component.setProps({ modelValue: options[1].value });
            component.vm.showOptions = true;

            component.vm.onSelect(options[0].value);

            expect(component.emitted()['update:modelValue']).toBeTruthy();
            expect(component.emitted()['update:modelValue'].length).toEqual(1);
            expect(component.emitted()['update:modelValue'][0]).toEqual([options[0].value]);
            expect(component.vm.showOptions).toBeFalsy();
        });

        test('should not emit event and close options panel when option is unchanged', async() => {
            await component.setProps({ modelValue: options[1].value });
            component.vm.showOptions = true;

            component.vm.onSelect(options[1].value);

            expect(component.emitted()['update:modelValue']).toBeFalsy();
            expect(component.vm.showOptions).toBeFalsy();
        });
    });
});
