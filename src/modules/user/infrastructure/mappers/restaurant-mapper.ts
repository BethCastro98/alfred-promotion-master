import ObjectUtils from '@utils/misc/object-utils';
import Restaurant from '@modules/user/domain/models/restaurant';
import FirebaseUtils from '@shared/infrastructure/firebase/firebase-utils';

export default class RestaurantMapper {
    static toDomain(item: any) {
        return Restaurant.fromPrimitives({
            id: item.id,
            name: item.name,
            logoUrl: item.logoUrl,
            description: item.description,
            schedule: item.schedule ? (Object.keys(item.schedule).reduce((acc, id) => {
                const el = item.schedule[id];
                return {
                    ...acc,
                    [id]: {
                        ...el,
                        startHour: el?.startHour ? FirebaseUtils.getDate(el.startHour) : undefined,
                        endHour: el?.endHour ? FirebaseUtils.getDate(el.endHour) : undefined
                    }
                };
            }, {})) : undefined,
            coverImageUrl: item.coverImageUrl,
            categoriesIds: item.categoriesIds,
            notificationEmail: item.notificationEmail,
            mallId: item.address
        });
    }

    static toDomainFromArray(items: any[]) {
        return items.map((p) => {
            try {
                const item = RestaurantMapper.toDomain(p);
                return item;
            } catch (e) {
                throw new Error(e);
            }
        });
    }

    static toPersistence(item: Restaurant) {
        const data = item.toPrimitives();
        return ObjectUtils.omitUnknown({
            id: data.id,
            name: data.name,
            logoUrl: data.logoUrl,
            coverImageUrl: data.coverImageUrl,
            categoriesIds: data.categoriesIds,
            description: data.description,
            schedule: ObjectUtils.omitUnknown(Object.keys(data.schedule).reduce((acc, id) => {
                return {
                    ...acc,
                    [id]: ObjectUtils.omitUnknown(data.schedule[id])
                };
            }, {})),
            notificationEmail: data.notificationEmail,
            address: data.mallId
        });
    }
}
