import AuthCredentials from '@modules/auth/domain/models/auth-credentials';
import UserIdentity from '@modules/auth/domain/models/user-identity';
import UserWithCredentials from '@modules/auth/domain/models/user-with-credentials';
import AppIdentityService from '@modules/auth/infrastructure/providers/app-identity-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthProvider from '../../domain/services/auth-provider';
import {
    createUserWithEmailAndPassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
    signInWithEmailAndPassword,
    updateEmail,
    updatePassword
} from 'firebase/auth';
import { getAuth } from '@shared/infrastructure/firebase/use-start-firebase';
import {
    apiTokenName,
    userAppDataKeyName,
    userDataKeyName,
    userRoleKeyName
} from '@modules/auth/infrastructure/providers/auth-constants';
import FirebaseAppUserRepository from '@modules/auth/infrastructure/providers/firebase-app-user-repository';
import AppUser from '@modules/auth/domain/models/app-user';

class AppAuthProvider implements AuthProvider {
    public state: any;
    public dispatch: any;

    private identityService: AppIdentityService;
    private userRepo: FirebaseAppUserRepository;

    constructor() {
        this.identityService = new AppIdentityService();
        this.userRepo = new FirebaseAppUserRepository();
    }


    private get firebaseAuth() {
        const auth = getAuth();
        return auth;
    }

    async login({
        email,
        password,
        restaurantId,
        isGuestUser
    }: AuthCredentials): Promise<any> {

        if (isGuestUser) {
            await this.saveGuestUserSession();
            return;
        }

        const user = await this.userRepo.findUserByCriteria({
            email: email,
            role: 'USER',
            restaurantId: restaurantId
        });

        if (!user) throw new Error('USER_NOT_FOUND');
        if (user.status === 'DELETED') throw new Error('USER_NOT_FOUND');
        if (user.status === 'DISABLED') throw new Error('USER_BLOCKED');

        const result = await signInWithEmailAndPassword(
            this.firebaseAuth,
            email,
            password
        );

        if (!result) throw new Error('USER_NOT_FOUND');

        await this.saveUserSession({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            roles: user.roles,
            type: user.type,
            restaurantId: user.restaurantId
        });
    }

    async register(user: UserWithCredentials): Promise<any> {
        await this.identityService.checkIdentity({
            email: user.email
        });

        const fbCredentials = await createUserWithEmailAndPassword(
            this.firebaseAuth,
            user.email,
            user.credentials.password
        );
        user.id = fbCredentials.user?.uid as string;


        await this.userRepo.createUser(user);
    }

    async deleteAppUser(user: UserWithCredentials): Promise<any> {


    }


    async changeEmail({ email, password }): Promise<any> {
        const currentUser = this.firebaseAuth.currentUser;

        const user = await this.userRepo.findUserByCriteria({
            email: email,
            role: 'USER'
        });

        if (!currentUser) return;

        if (user?.email === currentUser.email) throw new Error('SAME_USER_CONSTRAINT');

        if (user) throw new Error('USER_ALREADY_EXISTS');

        const credential = EmailAuthProvider.credential(
            currentUser.email!,
            password
        );

        try {
            await reauthenticateWithCredential(currentUser, credential);
        } catch (e) {
            throw new Error('INVALID_CREDENTIAL');
        }

        await updateEmail(currentUser, email);

        await this.updateIdentity({
            email: email
        });
    }


    async changePassword({ email, oldPassword, password }): Promise<any> {
        const currentUser = this.firebaseAuth.currentUser;

        const user = await this.userRepo.findUserByCriteria({
            email: email,
            role: 'USER'
        });

        if (!currentUser) return;


        const credential = EmailAuthProvider.credential(
            currentUser.email!,
            oldPassword
        );

        try {
            await reauthenticateWithCredential(currentUser, credential);
        } catch (e) {
            throw new Error('INVALID_CREDENTIAL');
        }

        await updatePassword(currentUser, password);
    }

    async checkAuth(params: any): Promise<void | UserIdentity> {
        return new Promise(async (resolve, reject) => {
            this.firebaseAuth.onAuthStateChanged(async (user) => {
                const identity = await this.getIdentity!();
                if (user && !!identity) {
                    resolve(identity);
                } else {
                    reject();
                }
            });
        });
    }

    async findAppUserByCriteria(criteria: {
        id?: string;
        phone?: string;
        email?: string;
    }): Promise<AppUser | null> {
        return this.userRepo.findAppUserByCriteria(criteria);
    }

    async getIdentity(): Promise<UserIdentity> {
        return this.identityService.getIdentity();
    }

    async updateIdentity(values: any): Promise<void> {
        await this.identityService.updateIdentity(values);
    }

    async checkIdentity(
        credentials: Pick<AuthCredentials, 'phone' | 'email'>
    ): Promise<any> {
        return this.identityService.checkIdentity(credentials);
    }

    async logout(params: any): Promise<void | false | string> {
        try {
            await this.firebaseAuth.signOut();
        } catch (e) {
        }

        await AsyncStorage.removeItem(apiTokenName);
        await AsyncStorage.removeItem(userRoleKeyName);
        await AsyncStorage.removeItem(userDataKeyName);
        await AsyncStorage.removeItem(userAppDataKeyName);

        const keys = await AsyncStorage.getAllKeys();

        await Promise.all(keys);
    }


    private async saveUserSession(dto: any) {
        const user = new UserIdentity({
            id: dto.id,
            email: dto.email,
            firstName: dto.firstName,
            lastName: dto.lastName,
            roles: dto.roles,
            type: dto.type,
            restaurantId: dto.restaurantId
        });

        await AsyncStorage.setItem(userRoleKeyName, 'USER');
        await AsyncStorage.setItem(
            userDataKeyName,
            JSON.stringify(user.toPrimitives())
        );

        return user;
    }

    private async saveGuestUserSession() {
        await this.saveUserSession({
            id: 'GUEST_USER',
            email: 'guest@guest.com',
            firstName: 'Guest',
            lastName: 'User',
            contactPhone: '11111111',
            identificationCardType: 'V',
            birthday: new Date()
        });
    }

}

export async function getLoggedInUserSession() {
    const service = new AppIdentityService();
    return service.getIdentity ? service.getIdentity() : null;
}

export default AppAuthProvider;
