import useUpdate from '@shared/domain/hooks/resources/use-update';
import ClientRepository from '@modules/clients/domain/repositories/client-repository';
import Client from '@modules/clients/domain/models/client';
import useNotify from '@shared/domain/hooks/use-notify';
import useService from '@shared/domain/hooks/use-service';
import FileUploader from '@shared/domain/services/file-uploader';

export default function useUpdateClient() {
    const notify = useNotify();
    const fileUploader = useService<FileUploader>('FileUploader');

    return useUpdate<Client, ClientRepository>({
        resource: 'clients',
        repository: 'ClientRepository',
        fn: async (repo, ...rest) => {

            const client = rest[1];

            const imageUrl = client?.imageUrl?.blob ? await fileUploader.uploadFile(
                client?.imageUrl.blob,
                `clients/${client.id}`,
                client?.imageUrl?.fileName
            ) : client?.imageUrl;

            client.updateImageUrl(imageUrl);

            return repo.createClient(client);
        },
        onSuccess: (response, queryClient, params) => {
            notify('Cliente actualizado', 'success');
        },
        onFailure: () => {
            notify('Error en actualizar', 'error');
        }
    });
}
