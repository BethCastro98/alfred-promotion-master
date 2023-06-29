import useNotify from '@shared/domain/hooks/use-notify';
import RestaurantArea from '@modules/tables/domain/models/restaurant-area';
import RestaurantAreaRepository from '@modules/tables/domain/repositories/restaurant-area-repository';
import useCreate from '@shared/domain/hooks/resources/use-create';

export default function useCreateRestaurantArea() {
    const notify = useNotify();

    return useCreate<RestaurantAreaRepository, RestaurantArea>({
        resource: 'restaurant-areas',
        repository: 'RestaurantAreaRepository',
        fn: (repo, ...rest) => repo.createArea(rest[0]),
        onSuccess: (response, queryClient, params) => {
        },
        onFailure: () => {
            notify('Error en crear la sección', 'error');
        }
    });
}
