import { shallowMount, VueWrapper } from '@vue/test-utils';

import WorkItemCard from './work-item-card.vue';

describe('work item card unit test', () => {
    let component: VueWrapper<any>;

    beforeEach(() => {
        component = shallowMount(WorkItemCard);
    });

    test('should create component instance', () => {
        expect(component).toBeTruthy();
    });
});
