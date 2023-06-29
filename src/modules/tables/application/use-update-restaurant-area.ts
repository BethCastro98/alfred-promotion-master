import useUpdate from '@shared/domain/hooks/resources/use-update';
import useNotify from '@shared/domain/hooks/use-notify';
import RestaurantArea from '@modules/tables/domain/models/restaurant-area';
import RestaurantAreaRepository from '@modules/tables/domain/repositories/restaurant-area-repository';

export default function useUpdateRestaurantArea() {
    const notify = useNotify();

    return useUpdate<RestaurantArea, RestaurantAreaRepository>({
        resource: 'restaurant-areas',
        repository: 'RestaurantAreaRepository',
        fn: (repo, ...rest) => repo.updateArea(rest[1]),
        onSuccess: (response, queryClient, params) => {
        },
        onFailure: () => {
            notify('Error en actualizar', 'error');
        }
    });
}
