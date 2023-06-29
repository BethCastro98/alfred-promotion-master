import FirestoreApiRepository from '@shared/infrastructure/firebase/firestore-api-repository';
import { getAuth } from '@shared/infrastructure/firebase/use-start-firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import AccountUser from '@modules/user/domain/models/account-user';
import AccountsRepository from '@modules/user/domain/repositories/accounts-repository';
import { getLoggedInUserSession } from '@modules/auth/infrastructure/providers/app-auth-provider';
import AccountMapper from '../mappers/account-mapper';
import { fetchJson } from '@shared/infrastructure/http/fetch';
import getApiUrl from '@shared/infrastructure/utils/get-api-url';

const COLLECTION_NAME = 'users';

export default class FirestoreAccountsRepository extends FirestoreApiRepository implements AccountsRepository {

    get firebaseAuth() {
        const auth = getAuth();
        return auth;
    }

    async findAll(): Promise<AccountUser[]> {
        const restaurantId = (await getLoggedInUserSession())?.restaurantId;
        if (!restaurantId) return Promise.resolve([]);
        const docs = await this.getDocs(COLLECTION_NAME, {
            filters: [
                {
                    field: 'restaurantId',
                    operator: '==',
                    value: restaurantId
                },
                {
                    field: 'status',
                    operator: '==',
                    value: 'ACTIVE'
                }
            ]
        });

        return AccountMapper.toDomainFromArray(docs);
    }

    async remove(id: string): Promise<void> {

        await fetchJson(getApiUrl('deleteUser'), {
            method: 'POST',
            body: JSON.stringify({
                id: id
            })
        });

        return this.updateDoc(COLLECTION_NAME, id, {
            status: 'DELETED'
        });
    }

    async save(user: AccountUser): Promise<void> {
        const dto = AccountMapper.toPersistence(user);

        const foundUser = await this.findByEmail(user.email);
        const restaurantId = (await getLoggedInUserSession())?.restaurantId;
        if (!restaurantId) {
            throw new Error('NOT_LOGGED');
        }

        if (foundUser) {

            if (user.hasCredentials) {
                await this.updateUserCredentials(user);
            }

            return this.updateDoc(COLLECTION_NAME, foundUser.id, { ...dto, restaurantId: restaurantId });
            /*throw new Error('USER_EXISTS');*/
        }

        if (!user.credentials) {
            throw new Error('INVALID_DATA');
        }

        const fbUser = await createUserWithEmailAndPassword(
            this.firebaseAuth,
            user.credentials.email,
            user.credentials.password as string
        );

        return this.saveDoc(COLLECTION_NAME, fbUser.user.uid, {
            ...dto,
            id: fbUser.user.uid,
            restaurantId: restaurantId
        });
    }

    async find(id: string): Promise<AccountUser | null> {
        const doc = await this.getDoc(COLLECTION_NAME, id);
        if (!doc) return null;

        return AccountMapper.toDomain(doc);
    }

    async findByEmail(email: string): Promise<AccountUser | null> {
        /*   const restaurantId = (await getLoggedInUserSession())?.restaurantId;
           if (!restaurantId) return Promise.resolve(null);*/
        const docs = await this.getDocs(COLLECTION_NAME, {
            filters: [
                /*   {
                       field: 'restaurantId',
                       operator: '==',
                       value: restaurantId
                   },*/
                {
                    field: 'status',
                    operator: '==',
                    value: 'ACTIVE'
                },
                {
                    field: 'email',
                    operator: '==',
                    value: email
                }
            ],
            limit: 1
        });

        if (docs.length == 0) return null;

        return AccountMapper.toDomain(docs[0]);
    }

    private async updateUserCredentials(user: AccountUser) {
        const currentUser = this.firebaseAuth.currentUser;

        if (!currentUser) return;

        /*  if (currentUser?.uid === user.id) {
              const credential = EmailAuthProvider.credential(
                  currentUser.email!,
                  user.credentials?.oldPassword
              );

              try {
                  await reauthenticateWithCredential(currentUser, credential);
              } catch (e) {
                  throw new Error('INVALID_CREDENTIAL');
              }

              if (user.credentials?.password) {
                  await updatePassword(currentUser, user.credentials?.password);
              }
              if (user.credentials?.email) {
                  await updateEmail(currentUser, user.credentials?.email);
              }
              return;
          }*/

        await fetchJson(getApiUrl('updateUser'), {
            method: 'POST',
            body: JSON.stringify({
                id: user.id,
                credentials: user.credentials
            })
        });
    }
}