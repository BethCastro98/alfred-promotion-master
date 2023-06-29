import AccountUser from '@modules/user/domain/models/account-user';
import ObjectUtils from '@utils/misc/object-utils';

export default class AccountMapper {

    static toDomain(dto: any): AccountUser {
        return AccountUser.fromPrimitives({
            id: dto.id,
            email: dto.email,
            firstName: dto.firstName,
            lastName: dto.lastName,
            status: dto.status,
            roles: dto.roles,
            type: dto.type,
            customPasswordConfigured: !!dto.customPasswordConfigured
        });
    }

    static toDomainFromArray(dtos: any[]): AccountUser[] {
        return dtos.map(dto => AccountMapper.toDomain(dto));
    }

    static toPersistenceFromArray(users: AccountUser[]): AccountUser[] {
        return users.map(m => AccountMapper.toPersistence(m));
    }

    static toPersistence(user: AccountUser): any {
        const dto = user.toPrimitives();

        return ObjectUtils.omitUnknown({
            id: dto.id,
            email: dto.email,
            status: 'ACTIVE',
            firstName: dto.firstName,
            lastName: dto.lastName,
            roles: dto.roles,
            type: dto.type,
            customPasswordConfigured: dto.customPasswordConfigured
        });
    }

}