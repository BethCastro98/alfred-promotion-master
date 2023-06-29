import ObjectUtils from '@utils/misc/object-utils';
import FirebaseUtils from '@shared/infrastructure/firebase/firebase-utils';
import TableSchedule from '@modules/tables/domain/models/table-schedule';

export default class TableScheduleMapper {
    static toDomain(item: any) {
        return TableSchedule.fromPrimitives({
            id: item.id,
            restaurantId: item.restaurantId,
            name: item.name,
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
                const item = TableScheduleMapper.toDomain(p);
                return item;
            } catch (e) {
                throw new Error(e);
            }
        });
    }

    static toPersistenceFromArray(items: TableSchedule[]) {
        return items.map((i) => TableScheduleMapper.toPersistence(i));
    }

    static toPersistence(item: TableSchedule) {
        const data = item.toPrimitives();
        return ObjectUtils.omitUnknown({
            id: data.id,
            restaurantId: data.restaurantId,
            name: data.name,
            schedule: ObjectUtils.omitUnknown(Object.keys(data.schedule).reduce((acc, id) => {
                return {
                    ...acc,
                    [id]: ObjectUtils.omitUnknown(data.schedule[id])
                };
            }, {}))
        });
    }
}
