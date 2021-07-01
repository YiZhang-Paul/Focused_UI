import { shallowMount, VueWrapper } from '@vue/test-utils';

import TextInput from './text-input.vue';

describe('text input unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(TextInput);
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

    describe('onEdit', () => {
        test('should not emit anything when instant update is off', async() => {
            await component.setProps({ isInstantUpdate: false });

            component.vm.onEdit();

            expect(component.emitted()['update:modelValue']).toBeFalsy();
        });

        test('should not emit anything when value is unchanged', async() => {
            await component.setProps({ isInstantUpdate: true, modelValue: 'previous_value' });
            component.vm.current = 'previous_value';

            component.vm.onEdit();

            expect(component.emitted()['update:modelValue']).toBeFalsy();
        });

        test('should emit updated value on instant update', async() => {
            await component.setProps({ isInstantUpdate: true, modelValue: 'previous_value' });
            component.vm.current = 'current_value';

            component.vm.onEdit();

            expect(component.emitted()['update:modelValue'].length).toEqual(1);
            expect(component.emitted()['update:modelValue'][0]).toEqual(['current_value']);
        });

        test('should default to empty string when input value is missing', async() => {
            await component.setProps({ isInstantUpdate: true, modelValue: null });
            component.vm.current = null;

            component.vm.onEdit();

            expect(component.emitted()['update:modelValue'].length).toEqual(1);
            expect(component.emitted()['update:modelValue'][0]).toEqual(['']);
        });
    });

    describe('onEditEnd', () => {
        beforeEach(() => {
            component.vm.isEditMode;
        });

        test('should not emit anything when instant update is on', async() => {
            await component.setProps({ isInstantUpdate: true });

            component.vm.onEditEnd();

            expect(component.emitted()['update:modelValue']).toBeFalsy();
        });

        test('should not emit anything when value is unchanged', async() => {
            await component.setProps({ isInstantUpdate: false, modelValue: 'previous_value' });
            component.vm.current = 'previous_value';

            component.vm.onEditEnd();

            expect(component.emitted()['update:modelValue']).toBeFalsy();
            expect(component.vm.isEditMode).toBeFalsy();
        });

        test('should not emit anything when value is empty', async() => {
            await component.setProps({ isInstantUpdate: false, isEmptyAllowed: false, modelValue: 'previous_value' });
            component.vm.current = ' ';

            component.vm.onEditEnd();

            expect(component.emitted()['update:modelValue']).toBeFalsy();
            expect(component.vm.isEditMode).toBeTruthy();
        });

        test('should emit empty string when allowed', async() => {
            await component.setProps({ isInstantUpdate: false, isEmptyAllowed: true, modelValue: 'previous_value' });
            component.vm.current = ' ';

            component.vm.onEditEnd();

            expect(component.emitted()['update:modelValue'].length).toEqual(1);
            expect(component.emitted()['update:modelValue'][0]).toEqual(['']);
            expect(component.vm.isEditMode).toBeFalsy();
        });

        test('should emit updated value and disable edit mode', async() => {
            await component.setProps({ isInstantUpdate: false, isEmptyAllowed: false, modelValue: 'previous_value' });
            component.vm.current = ' current_value ';

            component.vm.onEditEnd();

            expect(component.emitted()['update:modelValue'].length).toEqual(1);
            expect(component.emitted()['update:modelValue'][0]).toEqual(['current_value']);
            expect(component.vm.current).toEqual('current_value');
            expect(component.vm.isEditMode).toBeFalsy();
        });

        test('should default to empty string when input value is missing', async() => {
            await component.setProps({ isInstantUpdate: false, isEmptyAllowed: true, modelValue: null });
            component.vm.current = null;

            component.vm.onEditEnd();

            expect(component.emitted()['update:modelValue'].length).toEqual(1);
            expect(component.emitted()['update:modelValue'][0]).toEqual(['']);
            expect(component.vm.current).toEqual('');
            expect(component.vm.isEditMode).toBeFalsy();
        });
    });
});
