import useService from '@shared/domain/hooks/use-service';
import UseQueryValue from '@shared/domain/models/use-query-value';
import QueryCreator from '@shared/domain/services/query-creator';
import useRepository from '@shared/domain/hooks/use-repository';
import QueryOptions from '@shared/domain/models/query-options';
import RestaurantRepository from '@modules/user/domain/repositories/restaurant-repository';
import RestaurantCategory from '@modules/user/domain/models/restaurant-category';

type ResponseQueryValue = Omit<UseQueryValue, 'data'> & {
    data?: RestaurantCategory[];
};

export default function useFindRestaurantCategories(options?: QueryOptions): ResponseQueryValue {
    const repo = useRepository<RestaurantRepository>(
        'RestaurantRepository'
    );
    const queryCreator = useService<QueryCreator>('QueryCreator');

    const queryState: ResponseQueryValue = queryCreator.execute(
        {
            id: 'restaurant-categories',
            payload: {},
            type: ''
        },
        () => repo.findCategories(),
        {
            ...options ?? {}
        }
    );

    return queryState;
}
