import useService from '@shared/domain/hooks/use-service';
import UseQueryValue from '@shared/domain/models/use-query-value';
import QueryCreator from '@shared/domain/services/query-creator';
import useRepository from '@shared/domain/hooks/use-repository';
import QueryOptions from '@shared/domain/models/query-options';
import ProductRepository from '@modules/user/domain/repositories/product-repository';

type ResponseQueryValue = Omit<UseQueryValue, 'data'> & {
    data?: { id: string, name: string }[];
};

export default function useFindProductCategories(filters?: any, options?: QueryOptions): ResponseQueryValue {
    const repo = useRepository<ProductRepository>(
        'ProductRepository'
    );
    const queryCreator = useService<QueryCreator>('QueryCreator');

    const queryState: ResponseQueryValue = queryCreator.execute(
        {
            id: 'product-categories',
            payload: {
                filters
            },
            type: ''
        },
        () => {
            return Promise.resolve([{
                id: 'Alimento',
                name: 'Alimento'
            },
                {
                    id: 'Bebida',
                    name: 'Bebida'
                },
                {
                    id: 'Postre',
                    name: 'Postre'
                }]);
        },
        {
            ...options ?? {}
        }
    );

    return queryState;
}
