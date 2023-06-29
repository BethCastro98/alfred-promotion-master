import useService from '@shared/domain/hooks/use-service';
import UseQueryValue from '@shared/domain/models/use-query-value';
import QueryCreator from '@shared/domain/services/query-creator';
import useRepository from '@shared/domain/hooks/use-repository';
import QueryOptions from '@shared/domain/models/query-options';
import RestaurantMall from '@modules/user/domain/models/restaurant-mall';
import RestaurantMallRepository from '@modules/user/domain/repositories/restaurant-mall-repository';


type ResponseQueryValue = Omit<UseQueryValue, 'data'> & {
    data?: RestaurantMall[];
};

export default function useFindRestaurantMall(id: string, options?: QueryOptions): ResponseQueryValue {
    const repo = useRepository<RestaurantMallRepository>(
        'RestaurantMallRepository'
    );
    const queryCreator = useService<QueryCreator>('QueryCreator');

    const queryState: ResponseQueryValue = queryCreator.execute(
        {
            id: 'restaurant-malls',
            payload: {
                id
            },
            type: 'get'
        },
        () => repo.find(id),
        {
            ...options ?? {}
        }
    );

    return queryState;
}
