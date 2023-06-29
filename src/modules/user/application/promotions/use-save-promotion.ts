import MutationCreator from '@shared/domain/services/mutation-creator';
import useService from '@shared/domain/hooks/use-service';
import useRepository from '@shared/domain/hooks/use-repository';
import Mutation from '@shared/domain/models/mutation';
import FileUploader from '@shared/domain/services/file-uploader';
import Promotion from '@modules/user/domain/models/promotion';
import PromotionRepository from '@modules/user/domain/repositories/promotion-repository';

export default function useSavePromotion() {

    const repo = useRepository<PromotionRepository>('PromotionRepository');
    const mutationCreator = useService<MutationCreator>('MutationCreator');
    const fileUploader = useService<FileUploader>('FileUploader');

    const mutation: Mutation = {
        id: 'promotions',
        payload: {},
        type: 'save'
    };

    const [mutate, state] = mutationCreator.execute(
        mutation,
        async ({ entity, images }: { entity: Promotion, images: any }) => {

            const imageUrl = images.imageUrl?.blob ? await fileUploader.uploadFile(
                images.imageUrl.blob,
                `promotions/${entity.id}`,
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
        execute: async (entity: Promotion, images: any) => {
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
