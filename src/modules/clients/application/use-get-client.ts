import QueryOptions from '@shared/domain/models/query-options';
import ClientRepository from '@modules/clients/domain/repositories/client-repository';
import Client from '@modules/clients/domain/models/client';
import useGetOne from '@shared/domain/hooks/resources/use-get-one';

export default function useGetClient(
    id: string,
    options?: QueryOptions
) {
    return useGetOne<Client, ClientRepository>({
        resource: 'clients',
        repository: 'ClientRepository',
        id: id,
        fn: (repo, ...rest) => repo.getClient(...rest),
        options
    });
}
