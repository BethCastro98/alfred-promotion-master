import PaginationOptions from '@shared/domain/models/pagination-options';
import SortOptions from '@shared/domain/models/sort-options';
import QueryOptions from '@shared/domain/models/query-options';
import useGetList from '@shared/domain/hooks/resources/use-get-list';
import ClientRepository from '@modules/clients/domain/repositories/client-repository';
import Client from '@modules/clients/domain/models/client';

export default function useFindClients(
    filter?: any,
    pagination?: PaginationOptions,
    sort?: SortOptions,
    options?: QueryOptions
) {
    return useGetList<Client, ClientRepository>({
        resource: 'clients',
        repository: 'ClientRepository',
        filters: filter,
        fn: (repo, ...rest) => repo.findClients(...rest),
        pagination,
        sort,
        options
    });
}
