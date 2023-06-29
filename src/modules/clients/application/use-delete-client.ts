import useNotify from '@modules/_shared/domain/hooks/use-notify';
import useDelete from '@modules/_shared/domain/hooks/resources/use-delete';
import Client from '@modules/clients/domain/models/client';
import ClientRepository from '@modules/clients/domain/repositories/client-repository';


export function useDeleteClient() {
    const notify = useNotify();

    return useDelete<Client, ClientRepository>({
        resource: 'clients',
        repository: 'ClientRepository',
        fn: (repo, ...rest) => repo.deleteClient(...rest),
        onSuccess: (response, queryClient) => {
            notify('Cliente eliminado!', 'success');
        },
        onFailure: () => {
            notify('Error eliminando cliente', 'error');
        }
    });
}