import QueryOptions from '@shared/domain/models/query-options';
import useGetOne from '@shared/domain/hooks/resources/use-get-one';
import Reservation from '@modules/reservations/domain/models/reservation';
import ReservationRepository from '@modules/reservations/domain/respositories/reservation-repository';

export default function useGetReservation(
    id: string,
    options?: QueryOptions
) {
    return useGetOne<Reservation, ReservationRepository>({
        resource: 'reservations',
        repository: 'ReservationRepository',
        id: id,
        fn: (repo, ...rest) => repo.getReservation(...rest),
        options
    });
}
