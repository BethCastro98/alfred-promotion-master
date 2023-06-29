import PaginationOptions from '@shared/domain/models/pagination-options';
import SortOptions from '@shared/domain/models/sort-options';
import QueryOptions from '@shared/domain/models/query-options';
import useGetList from '@shared/domain/hooks/resources/use-get-list';
import ReservationRepository from '@modules/reservations/domain/respositories/reservation-repository';
import Reservation from '@modules/reservations/domain/models/reservation';

export default function useFindReservations(
    filter?: any,
    pagination?: PaginationOptions,
    sort?: SortOptions,
    options?: QueryOptions
) {
    return useGetList<Reservation, ReservationRepository>({
        resource: 'reservations',
        repository: 'ReservationRepository',
        filters: filter,
        fn: (repo, ...rest) => repo.findReservations(...rest),
        pagination,
        sort,
        options
    });
}
