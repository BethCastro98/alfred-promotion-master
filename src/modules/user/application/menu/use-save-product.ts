import MutationCreator from '@shared/domain/services/mutation-creator';
import useService from '@shared/domain/hooks/use-service';
import useRepository from '@shared/domain/hooks/use-repository';
import Mutation from '@shared/domain/models/mutation';
import FileUploader from '@shared/domain/services/file-uploader';
import ProductRepository from '@modules/user/domain/repositories/product-repository';
import Product from '@modules/user/domain/models/product';

export default function useSaveProduct() {

    const repo = useRepository<ProductRepository>('ProductRepository');
    const mutationCreator = useService<MutationCreator>('MutationCreator');
    const fileUploader = useService<FileUploader>('FileUploader');

    const mutation: Mutation = {
        id: 'products',
        payload: {},
        type: 'save'
    };

    const [mutate, state] = mutationCreator.execute(
        mutation,
        async ({ entity, images }: { entity: Product, images: any }) => {

            const imageUrl = images.imageUrl?.blob ? await fileUploader.uploadFile(
                images.imageUrl.blob,
                `products/${entity.id}`,
                images.imageUrl?.fileName
            ) : images.imageUrl;

            entity.updateImageUrl(imageUrl);

            await repo.save(entity);
        },
        {
            onFailure: () => {

            },
            onSuccess: async (response, queryClient) => {
                await queryClient.invalidateQueries({
                    predicate: (query) => {
                        const queryKey: any = query.queryKey[0];
                        return [mutation.id]
                        .map((i) => i)
                        .includes(queryKey.id);
                    }
                });
            }
        }
    );

    return {
        execute: async (entity: Product, images: any) => {
            return mutate({
                ...mutation,
                payload: {
                    entity: entity,
                    images
                }
            });
        },
        loading: state.loading,
        loaded: state.loaded,
        data: null
    };

}
