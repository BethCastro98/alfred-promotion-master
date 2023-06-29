import PaginationOptions from '@shared/domain/models/pagination-options';
import SortOptions from '@shared/domain/models/sort-options';
import Reservation from '@modules/reservations/domain/models/reservation';

export default interface ReservationRepository {
    findReservations(
        filter?: any,
        pagination?: PaginationOptions,
        sort?: SortOptions
    ): Promise<Reservation[]>;

    getReservation(
        id: string
    ): Promise<Reservation | undefined>;

    updateReservation(item: Reservation): Promise<any>;

    createReservation(item: Reservation): Promise<any>;

    deleteReservation(id: string): Promise<any>;
}