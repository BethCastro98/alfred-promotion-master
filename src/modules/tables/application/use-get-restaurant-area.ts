import useFindRestaurantAreas from '@modules/tables/application/use-find-restaurant-areas';
import QueryOptions from '@shared/domain/models/query-options';

export default function useGetRestaurantArea(id: string, options?: QueryOptions) {
    const { data, loading } = useFindRestaurantAreas({}, undefined, undefined, options);
    return {
        data: (data ?? {})[id],
        loading
    };
}