import { shallowMount, VueWrapper } from '@vue/test-utils';

import TextareaInput from './textarea-input.vue';

describe('textarea input unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(TextareaInput);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('onEditStart', () => {
        test('should enable edit mode', () => {
            component.vm.onEditStart();

            expect(component.vm.isEditMode).toBeTruthy();
        });
    });

    describe('onEditEnd', () => {
        test('should emit updated value and disable edit mode', async() => {
            await component.setProps({ modelValue: 'previous_value' });
            component.vm.current = 'current_value';
            component.vm.isEditMode = true;
            component.vm.isBlurIgnored = true;

            component.vm.onEditEnd();

            expect(component.emitted()['update:modelValue'].length).toEqual(1);
            expect(component.emitted()['update:modelValue'][0]).toEqual(['current_value']);
            expect(component.vm.isEditMode).toBeFalsy();
            expect(component.vm.isBlurIgnored).toBeFalsy();
        });

        test('should not emit anything when value is unchanged', async() => {
            await component.setProps({ modelValue: 'previous_value' });
            component.vm.current = 'previous_value';

            component.vm.onEditEnd();

            expect(component.emitted()['update:modelValue']).toBeFalsy();
        });
    });
});
