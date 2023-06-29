import useNotify from '@shared/domain/hooks/use-notify';
import useCreate from '@shared/domain/hooks/resources/use-create';
import ClientRepository from '@modules/clients/domain/repositories/client-repository';
import Client from '../domain/models/client';
import useService from '@shared/domain/hooks/use-service';
import FileUploader from '@shared/domain/services/file-uploader';

export default function useCreateClient() {
    const notify = useNotify();
    const fileUploader = useService<FileUploader>('FileUploader');

    return useCreate<ClientRepository, Client>({
        resource: 'clients',
        repository: 'ClientRepository',
        fn: async (repo, ...rest) => {

            const client = rest[0];

            const imageUrl = client?.imageUrl?.blob ? await fileUploader.uploadFile(
                client?.imageUrl.blob,
                `clients/${client.id}`,
                client?.imageUrl?.fileName
            ) : client?.imageUrl;

            client.updateImageUrl(imageUrl);

            return repo.createClient(client);
        },
        onSuccess: (response, queryClient, params) => {
        },
        onFailure: () => {
            notify('Error al guardar', 'error');
        }
    });
}
