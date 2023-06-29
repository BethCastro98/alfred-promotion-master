import ObjectUtils from '@utils/misc/object-utils';
import Reservation from '@modules/reservations/domain/models/reservation';
import DatetimeUtils from '@utils/misc/datetime-utils';
import FirebaseUtils from '@shared/infrastructure/firebase/firebase-utils';

export default class ReservationMapper {
    static toDomain(item: any) {
        return Reservation.fromPrimitives({
            id: item.id,
            client: item.client,
            restaurant: item.restaurant,
            code: item.code,
            date: item.date,
            hour: item.hour,
            mall: item.mall,
            numberOfPeople: item.numberOfPeople,
            table: item.table,
            status: item.status,
            checkedIn: item.checkedIn ?? false,
            checkedInAt: item.checkedInAt ? FirebaseUtils.getDate(item.checkedIn) : undefined
        });
    }

    static toDomainFromArray(items: any[]) {
        return items.map((p) => {
            try {
                const item = ReservationMapper.toDomain(p);
                return item;
            } catch (e) {
                throw new Error(e);
            }
        });
    }

    static toPersistence(item: Reservation) {
        const data = item.toPrimitives();
        return ObjectUtils.omitUnknown({
            id: data.id,
            client: ObjectUtils.omitUnknown(data.client),
            restaurant: ObjectUtils.omitUnknown(data.restaurant),
            code: data.code,
            date: data.date,
            status: data.status,
            hour: data.hour,
            mall: ObjectUtils.omitUnknown(data.mall),
            numberOfPeople: data.numberOfPeople,
            table: ObjectUtils.omitUnknown(data.table),
            checkedInAt: data.checkedInAt,
            checkedIn: data.checkedIn,
            datetime: DatetimeUtils.toTimezone(DatetimeUtils.fromString(`${data.date} ${data.hour}`, 'YYYY-MM-DD HH:mm'), 'UTC')
        });
    }
}
