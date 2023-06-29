import ObjectUtils from '@utils/misc/object-utils';
import RestaurantTable from '@modules/tables/domain/models/restaurant-table';
import FirebaseUtils from '@shared/infrastructure/firebase/firebase-utils';

export default class TableMapper {
    static toDomain(item: any) {
        return RestaurantTable.fromPrimitives({
            id: item.id,
            capacity: item.capacity,
            reservationDuration: item.reservationDuration,
            areaId: item.areaId,
            number: item.number,
            schedule: (Object.keys(item.schedule).reduce((acc, id) => {
                const el = item.schedule[id];
                return {
                    ...acc,
                    [id]: {
                        ...el,
                        startHour: el?.startHour ? FirebaseUtils.getDate(el.startHour) : undefined,
                        endHour: el?.endHour ? FirebaseUtils.getDate(el.endHour) : undefined
                    }
                };
            }, {}))
        });
    }

    static toDomainFromArray(items: any[]) {
        return items.map((p) => {
            try {
                const item = TableMapper.toDomain(p);
                return item;
            } catch (e) {
                throw new Error(e);
            }
        });
    }

    static toPersistenceFromArray(items: RestaurantTable[]) {
        return items.map((i) => TableMapper.toPersistence(i));
    }

    static toPersistence(item: RestaurantTable) {
        const data = item.toPrimitives();
        return ObjectUtils.omitUnknown({
            id: data.id,
            capacity: data.capacity,
            reservationDuration: data.reservationDuration,
            areaId: data.areaId,
            number: data.number,
            schedule: ObjectUtils.omitUnknown(Object.keys(data.schedule).reduce((acc, id) => {
                return {
                    ...acc,
                    [id]: ObjectUtils.omitUnknown(data.schedule[id])
                };
            }, {}))
        });
    }
}
