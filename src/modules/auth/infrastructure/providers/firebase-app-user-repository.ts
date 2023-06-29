import FirestoreApiRepository, { QueryFilter } from '@shared/infrastructure/firebase/firestore-api-repository';
import AppUser from '@modules/auth/domain/models/app-user';
import { USER_ROLE } from '@modules/auth/domain/services/auth-provider';
import ObjectUtils from '@utils/misc/object-utils';
import UserWithCredentials from '@modules/auth/domain/models/user-with-credentials';
import { getLoggedInUserSession } from '@modules/auth/infrastructure/providers/app-auth-provider';
import PaginationOptions from '@shared/domain/models/pagination-options';
import SortOptions from '@shared/domain/models/sort-options';

export default class FirebaseAppUserRepository extends FirestoreApiRepository {

    async findAppUserByCriteria({
        phone,
        email,
        id
    }: { id?: string; phone?: string; email?: string }): Promise<AppUser | null> {

        const user = await this.findUserByCriteria({
            id: id,
            phone: phone,
            email: email,
            role: 'all'
        });

        if (!user) return null;

        return AppUser.fromPrimitives({
            roles: user.roles ? user.roles : [user.role],
            email: user.email,
            firstName: user.firstName,
            id: user.id,
            lastName: user.lastName,
            type: user.type
        });
    }

    async findAccounts(
        filter?: any,
        pagination?: PaginationOptions,
        sort?: SortOptions
    ): Promise<AppUser[]> {
        const restaurantId = (await getLoggedInUserSession())?.restaurantId;
        if (!restaurantId) return Promise.resolve([]);

        const users = await this.getDocs('users', {
            filters: [{
                field: 'restaurantId',
                operator: '==',
                value: restaurantId
            }, {
                field: 'roles',
                operator: 'array-contains',
                value: 'USER'
            }]
        });

        return users.map((user) => {
            return AppUser.fromPrimitives({
                roles: user.roles ? user.roles : [user.role],
                email: user.email,
                firstName: user.firstName,
                id: user.id,
                lastName: user.lastName,
                type: user.type
            });
        });
    }

    async getUserProfile(id: string, role: USER_ROLE) {

        const collectionMap = {
            'CUSTOMER': 'customers',
            'RIDER': 'riders',
            'VENDOR': 'vendors'
        };

        const foundUser = await this.getDoc(collectionMap[role], id);

        if (!foundUser) return null;

        return {
            id: foundUser.id,
            email: foundUser.email,
            ...foundUser
        };
    }

    async updateUser(id: any, data: any) {
        await this.updateDoc('users', id, ObjectUtils.omitUnknown(data));
    }

    async createUser(user: UserWithCredentials) {
        await this.setDoc('users', user.id, ObjectUtils.omitUnknown({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email?.toLowerCase(),
            roles: ['USER'],
            status: 'ACTIVE',
            type: user.type,
            createdAt: user.signedUpAt,
            restaurantId: user.restaurantId
        }));
    }

    async findUserByCriteria(
        criteria: {
            phone?: string,
            email?: string,
            id?: string,
            role: USER_ROLE | 'all'
            restaurantId?: string
        }
    ): Promise<any> {

        const filters: QueryFilter[] = [];


        if (Object.keys(criteria).length == 0) return null;

        if (criteria.phone) {
            filters.push({
                field: 'phone',
                operator: '==',
                value: criteria.phone
            });
        }

        if (criteria.restaurantId) {
            filters.push({
                field: 'restaurantId',
                operator: '==',
                value: criteria.restaurantId
            });
        }

        if (criteria.email) {
            filters.push({
                field: 'email',
                operator: '==',
                value: criteria.email?.toLowerCase()
            });
        }

        if (criteria.role !== 'all') {
            filters.push({
                field: 'roles',
                operator: 'array-contains',
                value: criteria.role
            });
        }

        if (criteria.id) {
            filters.push({
                field: 'id',
                operator: '==',
                value: criteria.id
            });
        }

        let docs = await this.getDocs('users', {
            filters: filters
        });

        if (docs.length == 0) {
            return null;
        }

        const foundUser = docs[0];

        return {
            id: foundUser.id,
            email: foundUser.email,
            ...foundUser
        };
    }

}