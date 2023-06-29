import Client from '@modules/clients/domain/models/client';
import ObjectUtils from '@utils/misc/object-utils';

export default class ClientMapper {
    static toDomain(item: any) {
        return Client.fromPrimitives({
            id: item.id,
            email: item.email,
            firstName: item.firstName,
            lastName: item.lastName,
            allergies: item.allergies,
            phone: item.phone,
            status: item.status,
            imageUrl: item.imageUrl,
            restaurantId: item.restaurantId,
            favoriteTable: item.favoriteTable
        });
    }

    static toDomainFromArray(items: any[]) {
        return items.map((p) => {
            try {
                const item = ClientMapper.toDomain(p);
                return item;
            } catch (e) {
                throw new Error(e);
            }
        });
    }

    static toPersistence(item: Client) {
        const data = item.toPrimitives();
        return ObjectUtils.omitUnknown({
            id: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            imageUrl: data.imageUrl,
            status: data.status,
            allergies: data.allergies,
            restaurantId: data.restaurantId,
            favoriteTable: data.favoriteTable
        });
    }
}
