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
    >(namespace: string, getterKey: GetterKey, mutationKey: MutationKey, actionKey: ActionKey, getStore: () => Store<any>) {
        return {
            getter: getterKey,
            mutation: mutationKey,
            action: actionKey,
            state: (): State => getStore().state[namespace],
            getters<T extends keyof Getters>(getter: T): ReturnType<Getters[T]> {
                return getStore().getters[`${namespace}/${getter}`];
            },
            commit(mutation: keyof Mutations, payload: any): void {
                getStore().commit(`${namespace}/${mutation}`, payload);
            },
            async dispatch<T extends keyof Actions>(action: T, payload?: any): Promise<Unpacked<ReturnType<Actions[T]>>> {
                return await getStore().dispatch(`${namespace}/${action}`, payload);
            }
        };
    }
}
