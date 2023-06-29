import ObjectUtils from '@utils/misc/object-utils';
import RestaurantArea from '@modules/tables/domain/models/restaurant-area';
import TableMapper from '@modules/tables/infrastructure/mappers/table-mapper';

export default class AreaMapper {
    static toDomain(item: any) {
        return RestaurantArea.fromPrimitives({
            id: item.id,
            name: item.name,
            tables: TableMapper.toDomainFromArray(item.tables).map((t) => t.toPrimitives()),
            restaurantId: item.restaurantId
        });
    }

    static toDomainFromArray(items: any[]) {
        return items.map((p) => {
            try {
                const item = AreaMapper.toDomain(p);
                return item;
            } catch (e) {
                throw new Error(e);
            }
        });
    }

    static toPersistence(item: RestaurantArea) {
        const data = item.toPrimitives();
        return ObjectUtils.omitUnknown({
            id: data.id,
            name: data.name,
            restaurantId: data.restaurantId,
            tables: TableMapper.toPersistenceFromArray(item.tables)
        });
    }
}
