import AsyncStorage from '@react-native-async-storage/async-storage';
import UserIdentity from '@modules/auth/domain/models/user-identity';
import AuthCredentials from '@modules/auth/domain/models/auth-credentials';
import { userDataKeyName } from '@modules/auth/infrastructure/providers/auth-constants';
import FirebaseAppUserRepository from '@modules/auth/infrastructure/providers/firebase-app-user-repository';

export default class AppIdentityService extends FirebaseAppUserRepository {


    async checkIdentity(credentials: Pick<AuthCredentials, 'email'>): Promise<any> {

        const emailUser = await this.findUserByCriteria({
            email: credentials.email,
            role: 'USER'
        });


        if (!!emailUser) throw new Error('FOUND_IDENTITY');
    }

    async updateIdentity(values: any): Promise<void> {
        const value = await AsyncStorage.getItem(userDataKeyName);

        if (!value) return; // throw new Error('Empty');

        const currentValue = JSON.parse(value);
        const newUserData = UserIdentity.fromPrimitives({
            ...currentValue,
            ...values
        });

        await AsyncStorage.setItem(
            userDataKeyName,
            JSON.stringify(newUserData.toPrimitives())
        );
    }

    async getIdentity(): Promise<UserIdentity | null> {
        const value = await AsyncStorage.getItem(userDataKeyName);

        if (!value) return null; //throw new Error('Empty');

        const parsedValue = JSON.parse(value);

        return UserIdentity.fromPrimitives(parsedValue);
    }

}