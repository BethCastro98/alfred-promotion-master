import useUpdate from '@shared/domain/hooks/resources/use-update';
import useNotify from '@shared/domain/hooks/use-notify';
import RestaurantRepository from '@modules/user/domain/repositories/restaurant-repository';
import Restaurant from '@modules/user/domain/models/restaurant';
import useService from '@shared/domain/hooks/use-service';
import FileUploader from '@shared/domain/services/file-uploader';

export default function useUpdateRestaurant() {
    const notify = useNotify();
    const fileUploader = useService<FileUploader>('FileUploader');

    return useUpdate<Restaurant, RestaurantRepository>({
        resource: 'restaurant-profile',
        repository: 'RestaurantRepository',
        fn: async (repo, ...rest) => {

            const entity = rest[1];
            const logoUrl = entity.logoUrl?.blob ? await fileUploader.uploadFile(
                entity.logoUrl.blob,
                `restaurants/${entity.id}/logo`,
                entity.logoUrl?.fileName
            ) : entity.logoUrl;

            entity.updateLogoUrl(logoUrl);

            const coverImageUrl = entity.coverImageUrl?.blob ? await fileUploader.uploadFile(
                entity.coverImageUrl.blob,
                `restaurants/${entity.id}/coverImage`,
                entity.coverImageUrl?.fileName
            ) : entity.coverImageUrl;

            entity.updateCoverImageUrl(coverImageUrl);

            return repo.updateRestaurant(entity);
        },
        onSuccess: (response, queryClient, params) => {
        },
        onFailure: () => {
            notify('Error en actualizar', 'error');
        }
    });
}
