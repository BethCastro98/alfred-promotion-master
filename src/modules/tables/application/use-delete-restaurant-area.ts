import useNotify from '@modules/_shared/domain/hooks/use-notify';
import useDelete from '@modules/_shared/domain/hooks/resources/use-delete';
import RestaurantArea from '@modules/tables/domain/models/restaurant-area';
import RestaurantAreaRepository from '@modules/tables/domain/repositories/restaurant-area-repository';


export function useDeleteRestaurantArea() {
    const notify = useNotify();

    return useDelete<RestaurantArea, RestaurantAreaRepository>({
        resource: 'restaurant-areas',
        repository: 'RestaurantAreaRepository',
        fn: (repo, ...rest) => repo.deleteArea(...rest),
        onSuccess: (response, queryClient) => {
            notify('Area eliminada!', 'success');
        },
        onFailure: () => {
            notify('Error eliminando area', 'error');
        }
    });
}