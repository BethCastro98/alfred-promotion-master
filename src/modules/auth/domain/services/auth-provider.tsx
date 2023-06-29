import UserIdentity from '../models/user-identity';
import UserWithCredentials from '@modules/auth/domain/models/user-with-credentials';
import AppUser from '@modules/auth/domain/models/app-user';
import AuthCredentials from '@modules/auth/domain/models/auth-credentials';

export type USER_ROLE = 'USER' | 'ADMIN'

export default interface AuthProvider {
    state: any;
    dispatch: any;

    login(params: AuthCredentials): Promise<any>;

    register(user: UserWithCredentials): Promise<any>;

    findAppUserByCriteria(
        criteria: {
            id?: string;
            phone?: string
            email?: string;
        }
    ): Promise<AppUser | null>;

    changeEmail(params: any): Promise<any>;

    changePassword(params: any): Promise<any>;

    logout(params: any): Promise<void | false | string>;

    checkAuth(params: any): Promise<void | UserIdentity>;

    checkIdentity(credentials: Pick<AuthCredentials, 'phone' | 'email'>): Promise<any>;

    getIdentity?(): Promise<UserIdentity>;

    updateIdentity(params: any): Promise<void>;

}
