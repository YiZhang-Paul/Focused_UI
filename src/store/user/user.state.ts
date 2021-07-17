import { UserProfile } from '../../core/models/user/user-profile';

export interface IState {
    profile: UserProfile | null;
}

export const state = (): IState => ({
    profile: null
});
