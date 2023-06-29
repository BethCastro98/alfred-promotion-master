import ObjectUtils from '@utils/misc/object-utils';
import FirebaseUtils from '@shared/infrastructure/firebase/firebase-utils';
import Promotion from '@modules/user/domain/models/promotion';

export default class PromotionMapper {
    static toDomain(dto: any): Promotion {
        return Promotion.fromPrimitives({
            id: dto.id,
            imageUrl: dto.imageUrl,
            description: dto.description,
            available: dto.available,
            duration: {
                start: FirebaseUtils.getDate(dto.duration.start),
                end: FirebaseUtils.getDate(dto.duration.end)
            },
            mallsIds: dto.mallsIds ?? [],
            name: dto.name,
            createdAt: FirebaseUtils.getDate(dto.createdAt),
            status: dto.status,
            restaurantId: dto.restaurantId
        });
    }

    static toDomainFromArray(dtos: any[]): Promotion[] {
        return dtos.map(dto => PromotionMapper.toDomain(dto));
    }

    static toPersistence(restaurant: Promotion): any {
        const dto = restaurant.toPrimitives();

        return ObjectUtils.omitUnknown({
            id: dto.id,
            imageUrl: dto.imageUrl,
            available: dto.available,
            createdAt: dto.createdAt,
            mallsIds: dto.mallsIds,
            name: dto.name,
            status: dto.status,
            description: dto.description,
            duration: dto.duration,
            restaurantId: dto.restaurantId
        });
    }


}