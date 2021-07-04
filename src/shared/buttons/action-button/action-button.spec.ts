import { shallowMount, VueWrapper } from '@vue/test-utils';

import { ActionButtonType } from '../../../core/enums/action-button-type.enum';

import ActionButton from './action-button.vue';

describe('action button unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(ActionButton);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('buttonClasses', () => {
        test('should return correct classes', async() => {
            await component.setProps({ type: ActionButtonType.Regular });
            expect(component.vm.buttonClasses['confirm-button']).toBeFalsy();
            expect(component.vm.buttonClasses['warning-button']).toBeFalsy();

            await component.setProps({ type: ActionButtonType.Confirm });
            expect(component.vm.buttonClasses['confirm-button']).toBeTruthy();
            expect(component.vm.buttonClasses['warning-button']).toBeFalsy();

            await component.setProps({ type: ActionButtonType.Warning });
            expect(component.vm.buttonClasses['confirm-button']).toBeFalsy();
            expect(component.vm.buttonClasses['warning-button']).toBeTruthy();
        });
    });
});
