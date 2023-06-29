import useUpdate from '@shared/domain/hooks/resources/use-update';
import useNotify from '@shared/domain/hooks/use-notify';
import Reservation from '@modules/reservations/domain/models/reservation';
import ReservationRepository from '@modules/reservations/domain/respositories/reservation-repository';

export default function useUpdateReservation() {
    const notify = useNotify();

    return useUpdate<Reservation, ReservationRepository>({
        resource: 'reservations',
        repository: 'ReservationRepository',
        fn: (repo, ...rest) => repo.updateReservation(rest[1]),
        onSuccess: (response, queryClient, params) => {
            notify('Reservación actualizado', 'success');
        },
        onFailure: () => {
            notify('Error en actualizar', 'error');
        }
    });
}
