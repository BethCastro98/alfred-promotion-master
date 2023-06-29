import FirestoreApiRepository from '@shared/infrastructure/firebase/firestore-api-repository';
import PaginationOptions from '@modules/_shared/domain/models/pagination-options';
import SortOptions from '@shared/domain/models/sort-options';
import { getLoggedInUserSession } from '@modules/auth/infrastructure/providers/app-auth-provider';
import { getDocs } from 'firebase/firestore';
import ReservationRepository from '@modules/reservations/domain/respositories/reservation-repository';
import Reservation from '@modules/reservations/domain/models/reservation';
import ReservationMapper from '@modules/reservations/infrastructure/mappers/reservation-mapper';

const COLLECTION_NAME = 'reservations';

export default class FirebaseReservationRepository extends FirestoreApiRepository implements ReservationRepository {

    async findReservations(
        filter?: any,
        pagination?: PaginationOptions,
        sort?: SortOptions
    ): Promise<Reservation[]> {
        const restaurantId = (await getLoggedInUserSession())?.restaurantId;
        if (!restaurantId) return Promise.resolve([]);

        const initialFilters = [
            {
                field: 'status',
                operator: '==',
                value: 'ACTIVE'
            },
            {
                field: 'restaurant.id',
                operator: '==',
                value: restaurantId
            }
        ];

        if (filter?.range) {
            initialFilters.push({
                field: 'datetime',
                operator: '=>',
                value: filter.range?.start
            });
            initialFilters.push({
                field: 'datetime',
                operator: '<=',
                value: filter.range?.end
            });
        }

        const ref = await FirebaseReservationRepository.applyPagination(COLLECTION_NAME, this.getQueryConstraints({
            filters: [
                {
                    field: 'status',
                    operator: '==',
                    value: 'ACTIVE'
                },
                {
                    field: 'restaurant.id',
                    operator: '==',
                    value: restaurantId
                }
            ],
            orderBy: {
                field: 'datetime',
                direction: 'desc'
            }
        }), pagination);

        const dtos = (await getDocs(ref)).docs.map(d => d.data());

        if (dtos.length == 0) {
            return [];
        }

        return ReservationMapper.toDomainFromArray(dtos);
    }

    async updateReservation(client: Reservation): Promise<any> {
        const data = ReservationMapper.toPersistence(client);
        await this.updateDoc(COLLECTION_NAME, client.id, data);
    }

    async deleteReservation(id: string): Promise<any> {
        return this.updateDoc(COLLECTION_NAME, id, {
            status: 'DELETED'
        });
    }

    async getReservation(id: string): Promise<Reservation | undefined> {
        const doc = await this.getDoc(COLLECTION_NAME, id);
        if (!doc) return undefined;

        return ReservationMapper.toDomain(doc);
    }

    async createReservation(item: Reservation): Promise<any> {
        const data = ReservationMapper.toPersistence(item);
        await this.saveDoc(COLLECTION_NAME, item.id, data);
    }
}