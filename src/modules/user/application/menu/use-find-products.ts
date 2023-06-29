import useService from '@shared/domain/hooks/use-service';
import UseQueryValue from '@shared/domain/models/use-query-value';
import QueryCreator from '@shared/domain/services/query-creator';
import useRepository from '@shared/domain/hooks/use-repository';
import QueryOptions from '@shared/domain/models/query-options';
import ProductRepository from '@modules/user/domain/repositories/product-repository';
import Product from '@modules/user/domain/models/product';

type ResponseQueryValue = Omit<UseQueryValue, 'data'> & {
    data?: Product[];
};

export default function useFindProducts(filters?: any, options?: QueryOptions): ResponseQueryValue {
    const repo = useRepository<ProductRepository>(
        'ProductRepository'
    );
    const queryCreator = useService<QueryCreator>('QueryCreator');

    const queryState: ResponseQueryValue = queryCreator.execute(
        {
            id: 'products',
            payload: {
                filters
            },
            type: ''
        },
        () => repo.findAll(filters),
        {
            ...options ?? {}
        }
    );

    return queryState;
}
