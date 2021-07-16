import { UserProfile } from '../../core/models/user/user-profile';

export interface IUserState {
    profile: UserProfile | null;
}

export const state = (): IUserState => ({
    profile: null
});
