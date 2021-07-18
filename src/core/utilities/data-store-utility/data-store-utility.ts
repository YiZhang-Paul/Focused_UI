import { Store } from 'vuex';

type Unpacked<T> = T extends Promise<infer R> ? R : T;
type Handlers = { [key: string]: (...args: any) => any };

export class DataStoreUtility {

    public static getHandlers<
        State,
        Getters extends Handlers,
        Mutations,
        Actions extends Handlers,
        GetterKey,
        MutationKey,
        ActionKey
    >(namespace: string, getterKey: GetterKey, mutationKey: MutationKey, actionKey: ActionKey) {
        return {
            keys: {
                getters: getterKey,
                mutations: mutationKey,
                actions: actionKey
            },
            state: (store: Store<any>): State => store.state[namespace],
            getters<T extends keyof Getters>(store: Store<any>, getter: T): ReturnType<Getters[T]> {
                return store.getters[`${namespace}/${getter}`];
            },
            commit(store: Store<any>, mutation: keyof Mutations, payload: any): void {
                store.commit(`${namespace}/${mutation}`, payload);
            },
            async dispatch<T extends keyof Actions>(
                store: Store<any>,
                action: T,
                payload?: any
            ): Promise<Unpacked<ReturnType<Actions[T]>>> {
                return await store.dispatch(`${namespace}/${action}`, payload);
            }
        };
    }
}
