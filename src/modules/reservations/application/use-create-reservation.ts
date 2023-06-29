import useNotify from '@shared/domain/hooks/use-notify';
import Reservation from '@modules/reservations/domain/models/reservation';
import ReservationRepository from '@modules/reservations/domain/respositories/reservation-repository';
import useCreate from '@shared/domain/hooks/resources/use-create';

export default function useCreateReservation() {
    const notify = useNotify();

    return useCreate<ReservationRepository, Reservation>({
        resource: 'reservations',
        repository: 'ReservationRepository',
        fn: (repo, ...rest) => repo.createReservation(rest[0]),
        onSuccess: (response, queryClient, params) => {
        },
        onFailure: () => {
            notify('Error al guardar', 'error');
        }
    });
}
