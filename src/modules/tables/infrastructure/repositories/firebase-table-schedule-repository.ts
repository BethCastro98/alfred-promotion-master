import FirestoreApiRepository from '@shared/infrastructure/firebase/firestore-api-repository';
import PaginationOptions from '@shared/domain/models/pagination-options';
import SortOptions from '@shared/domain/models/sort-options';
import { getDocs } from 'firebase/firestore';
import { getLoggedInUserSession } from '@modules/auth/infrastructure/providers/app-auth-provider';
import TableScheduleRepository from '@modules/tables/domain/repositories/table-schedule-repository';
import TableSchedule from '@modules/tables/domain/models/table-schedule';
import TableScheduleMapper from '@modules/tables/infrastructure/mappers/table-schedule-mapper';

const COLLECTION_NAME = 'table-schedules';

export default class FirebaseTableScheduleRepository extends FirestoreApiRepository implements TableScheduleRepository {

    async findSchedules(filter?: any, pagination?: PaginationOptions, sort?: SortOptions): Promise<TableSchedule[]> {
        const restaurantId = (await getLoggedInUserSession())?.restaurantId;
        if (!restaurantId) return Promise.resolve([]);

        const ref = await FirebaseTableScheduleRepository.applyPagination(COLLECTION_NAME, this.getQueryConstraints({
            filters: [{
                field: 'restaurantId',
                operator: '==',
                value: restaurantId
            }]
        }), pagination);

        const dtos = (await getDocs(ref)).docs.map(d => d.data());

        if (dtos.length == 0) {
            return [];
        }

        return TableScheduleMapper.toDomainFromArray(dtos);
    }

    async updateSchedule(item: TableSchedule): Promise<any> {
        const data = TableScheduleMapper.toPersistence(item);
        await this.updateDoc(COLLECTION_NAME, item.id, data);
    }

    async deleteSchedule(id: string): Promise<any> {
        await this.deleteDoc(COLLECTION_NAME, id);
    }

    async createSchedule(item: TableSchedule): Promise<any> {
        const data = TableScheduleMapper.toPersistence(item);
        await this.saveDoc(COLLECTION_NAME, item.id, data);
    }
}