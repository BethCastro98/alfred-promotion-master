import PaginationOptions from '@shared/domain/models/pagination-options';
import SortOptions from '@shared/domain/models/sort-options';
import QueryOptions from '@shared/domain/models/query-options';
import useGetList from '@shared/domain/hooks/resources/use-get-list';
import RestaurantAreaRepository from '@modules/tables/domain/repositories/restaurant-area-repository';
import RestaurantArea from '@modules/tables/domain/models/restaurant-area';

export default function useFindRestaurantAreas(
    filter?: any,
    pagination?: PaginationOptions,
    sort?: SortOptions,
    options?: QueryOptions
) {
    return useGetList<RestaurantArea, RestaurantAreaRepository>({
        resource: 'restaurant-areas',
        repository: 'RestaurantAreaRepository',
        filters: filter,
        fn: (repo, ...rest) => repo.findAreas(...rest),
        pagination,
        sort,
        options
    });
}
