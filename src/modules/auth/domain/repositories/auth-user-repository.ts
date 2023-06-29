import AppVersion from '@modules/auth/domain/models/app-version';

export default interface AuthUserRepository {

    resetPassword(userEmail: string): Promise<void>;

    getAppVersion(): Promise<AppVersion>;

}
