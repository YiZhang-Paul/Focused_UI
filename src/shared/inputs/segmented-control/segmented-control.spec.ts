import { shallowMount, VueWrapper } from '@vue/test-utils';

import { IconMeta } from '../../../core/models/generic/icon-meta';
import { ControlButtonOption } from '../../../core/models/generic/control-button-option';

import SegmentedControl from './segmented-control.vue';

describe('segmented control unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(SegmentedControl);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('onSelect', () => {
        let options: ControlButtonOption[];

        beforeEach(async() => {
            options = [
                { icon: { ...new IconMeta(), name: 'name_1' }, isActive: false },
                { icon: { ...new IconMeta(), name: 'name_2' }, isActive: true },
                { icon: { ...new IconMeta(), name: 'name_3' }, isActive: false }
            ];

            await component.setProps({ options });
        });

        test('should emit nothing when option is already selected', () => {
            const expected = JSON.parse(JSON.stringify(options));

            component.vm.onSelect(options[1]);

            expect(component.emitted().select).toBeFalsy();
            expect(component.vm.options).toEqual(expected);
        });

        test('should emit selected option', () => {
            const expected = [
                { icon: { ...new IconMeta(), name: 'name_1' }, isActive: true },
                { icon: { ...new IconMeta(), name: 'name_2' }, isActive: false },
                { icon: { ...new IconMeta(), name: 'name_3' }, isActive: false }
            ];

            component.vm.onSelect(options[0]);

            expect(component.emitted().select.length).toEqual(1);
            expect(component.emitted().select[0]).toEqual([options[0]]);
            expect(component.vm.options).toEqual(expected);
        });
    });
});
