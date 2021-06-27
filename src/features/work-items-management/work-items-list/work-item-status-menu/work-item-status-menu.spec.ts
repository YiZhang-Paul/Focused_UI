import { shallowMount, VueWrapper } from '@vue/test-utils';

import { WorkItemStatus } from '../../../../core/enums/work-item-status.enum';

import WorkItemStatusMenu from './work-item-status-menu.vue';

describe('work item status menu unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(WorkItemStatusMenu);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });

    describe('created', () => {
        test('should do nothing when no active option available', () => {
            const expected = [WorkItemStatus.Highlighted, WorkItemStatus.Ongoing, WorkItemStatus.Completed];
            component = shallowMount(WorkItemStatusMenu, { props: { activeOption: WorkItemStatus.Idle } });

            expect(component.vm.options.map((_: any) => _.status)).toEqual(expected);
        });

        test('should ensure active option is always in the middle', () => {
            const expected = [WorkItemStatus.Ongoing, WorkItemStatus.Highlighted, WorkItemStatus.Completed];
            component = shallowMount(WorkItemStatusMenu, { props: { activeOption: WorkItemStatus.Highlighted } });

            expect(component.vm.options.map((_: any) => _.status)).toEqual(expected);
        });
    });

    describe('getClasses', () => {
        test('should return correct classes', async() => {
            await component.setProps({ showOptions: true, activeOption: WorkItemStatus.Highlighted });

            expect(component.vm.getClasses(WorkItemStatus.Completed)).toEqual({
                icon: true,
                ongoing: false,
                'invisible-option': false,
                'active-option': false
            });

            await component.setProps({ showOptions: false, activeOption: WorkItemStatus.Ongoing });

            expect(component.vm.getClasses(WorkItemStatus.Ongoing)).toEqual({
                icon: true,
                ongoing: true,
                'invisible-option': true,
                'active-option': true
            });
        });
    });

    describe('onSelect', () => {
        test('should emit stop event', async() => {
            await component.setProps({ activeOption: WorkItemStatus.Ongoing });

            component.vm.onSelect(WorkItemStatus.Highlighted);
            expect(component.emitted().stop.length).toEqual(1);

            component.vm.onSelect(WorkItemStatus.Completed);
            expect(component.emitted().stop.length).toEqual(2);

            component.vm.onSelect(WorkItemStatus.Ongoing);
            expect(component.emitted().stop.length).toEqual(3);
        });

        test('should emit start event', async() => {
            await component.setProps({ activeOption: WorkItemStatus.Idle });
            component.vm.onSelect(WorkItemStatus.Ongoing);
            expect(component.emitted().start.length).toEqual(1);

            await component.setProps({ activeOption: WorkItemStatus.Highlighted });
            component.vm.onSelect(WorkItemStatus.Ongoing);
            expect(component.emitted().start.length).toEqual(2);

            await component.setProps({ activeOption: WorkItemStatus.Completed });
            component.vm.onSelect(WorkItemStatus.Ongoing);
            expect(component.emitted().start.length).toEqual(3);
        });

        test('should emit select event', async() => {
            await component.setProps({ activeOption: WorkItemStatus.Idle });

            component.vm.onSelect(WorkItemStatus.Highlighted);
            expect(component.emitted().select.length).toEqual(1);
            expect(component.emitted().select[0]).toEqual([WorkItemStatus.Highlighted]);

            component.vm.onSelect(WorkItemStatus.Completed);
            expect(component.emitted().select.length).toEqual(2);
            expect(component.emitted().select[1]).toEqual([WorkItemStatus.Completed]);

            await component.setProps({ activeOption: WorkItemStatus.Highlighted });

            component.vm.onSelect(WorkItemStatus.Highlighted);
            expect(component.emitted().select.length).toEqual(3);
            expect(component.emitted().select[2]).toEqual([WorkItemStatus.Idle]);

            component.vm.onSelect(WorkItemStatus.Completed);
            expect(component.emitted().select.length).toEqual(4);
            expect(component.emitted().select[3]).toEqual([WorkItemStatus.Completed]);

            await component.setProps({ activeOption: WorkItemStatus.Completed });

            component.vm.onSelect(WorkItemStatus.Highlighted);
            expect(component.emitted().select.length).toEqual(5);
            expect(component.emitted().select[4]).toEqual([WorkItemStatus.Highlighted]);

            component.vm.onSelect(WorkItemStatus.Completed);
            expect(component.emitted().select.length).toEqual(6);
            expect(component.emitted().select[5]).toEqual([WorkItemStatus.Idle]);
        });
    });
});
