import AuthUserRepository from '@modules/auth/domain/repositories/auth-user-repository';
import AppVersion from '@modules/auth/domain/models/app-version';
import FirestoreApiRepository from '@shared/infrastructure/firebase/firestore-api-repository';
import { sendPasswordResetEmail } from 'firebase/auth';

export default class ApiAuthUserRepository extends FirestoreApiRepository implements AuthUserRepository {

    async resetPassword(userEmail: string): Promise<void> {
        await sendPasswordResetEmail(this.firebaseAuth, userEmail);
    }


    async getAppVersion(): Promise<AppVersion> {
        const dto = await this.getDoc('app_configurations', 'GLOBAL_STATE');

        if (!dto) return {
            active: true
        };

        return {
            active: dto.available ?? true,
            title: dto.title,
            version: dto.appVersion,
            message: dto.message
        };
    }

}
