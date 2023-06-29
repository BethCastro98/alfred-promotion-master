import QueryOptions from '@shared/domain/models/query-options';
import useGetOne from '@shared/domain/hooks/resources/use-get-one';
import Restaurant from '@modules/user/domain/models/restaurant';
import RestaurantRepository from '@modules/user/domain/repositories/restaurant-repository';

export default function useGetRestaurantBySlug(
    id: string,
    options?: QueryOptions
) {
    return useGetOne<Restaurant, RestaurantRepository>({
        resource: 'restaurant-profile',
        repository: 'RestaurantRepository',
        id: id,
        fn: (repo, ...rest) => repo.getProfileBySlug(...rest),
        options
    });
}
