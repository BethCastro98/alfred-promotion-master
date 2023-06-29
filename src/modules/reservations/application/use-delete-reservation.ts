import useNotify from '@modules/_shared/domain/hooks/use-notify';
import useDelete from '@modules/_shared/domain/hooks/resources/use-delete';
import ReservationRepository from '@modules/reservations/domain/respositories/reservation-repository';
import Reservation from '../domain/models/reservation';


export function useDeleteReservation() {
    const notify = useNotify();

    return useDelete<Reservation, ReservationRepository>({
        resource: 'reservations',
        repository: 'ReservationRepository',
        fn: (repo, ...rest) => repo.deleteReservation(...rest),
        onSuccess: (response, queryClient) => {
            notify('Reservación eliminada!', 'success');
        },
        onFailure: () => {
            notify('Error eliminando reservación', 'error');
        }
    });
}