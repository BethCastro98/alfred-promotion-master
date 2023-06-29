import ObjectUtils from '@utils/misc/object-utils';
import FirebaseUtils from '@shared/infrastructure/firebase/firebase-utils';
import Product from '@modules/user/domain/models/product';

export default class ProductMapper {
    static toDomain(dto: any): Product {
        return Product.fromPrimitives({
            id: dto.id,
            imageUrl: dto.imageUrl,
            description: dto.description,
            available: dto.available,
            restaurantId: dto.restaurantId,
            unity: dto.unity,
            price: dto.price,
            name: dto.name,
            createdAt: FirebaseUtils.getDate(dto.createdAt),
            status: dto.status,
            category: dto.category
        });
    }

    static toDomainFromArray(dtos: any[]): Product[] {
        return dtos.map(dto => ProductMapper.toDomain(dto));
    }

    static toPersistence(item: Product): any {
        const dto = item.toPrimitives();

        return ObjectUtils.omitUnknown({
            id: dto.id,
            imageUrl: dto.imageUrl,
            description: dto.description,
            available: dto.available,
            restaurantId: dto.restaurantId,
            unity: dto.unity,
            price: dto.price,
            name: dto.name,
            createdAt: dto.createdAt,
            status: dto.status,
            category: dto.category
        });
    }


}