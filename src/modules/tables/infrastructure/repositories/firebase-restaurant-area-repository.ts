import FirestoreApiRepository from '@shared/infrastructure/firebase/firestore-api-repository';
import RestaurantAreaRepository from '@modules/tables/domain/repositories/restaurant-area-repository';
import PaginationOptions from '@shared/domain/models/pagination-options';
import RestaurantArea from '@modules/tables/domain/models/restaurant-area';
import SortOptions from '@shared/domain/models/sort-options';
import { getDocs } from 'firebase/firestore';
import AreaMapper from '@modules/tables/infrastructure/mappers/area-mapper';
import { getLoggedInUserSession } from '@modules/auth/infrastructure/providers/app-auth-provider';

const COLLECTION_NAME = 'restaurant-areas';

export default class FirebaseRestaurantAreaRepository extends FirestoreApiRepository implements RestaurantAreaRepository {

    async findAreas(filter?: any, pagination?: PaginationOptions, sort?: SortOptions): Promise<RestaurantArea[]> {
        const restaurantId = (await getLoggedInUserSession())?.restaurantId;
        if (!restaurantId) return Promise.resolve([]);

        const ref = await FirebaseRestaurantAreaRepository.applyPagination(COLLECTION_NAME, this.getQueryConstraints({
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

        return AreaMapper.toDomainFromArray(dtos);
    }

    async updateArea(item: RestaurantArea): Promise<any> {
        const data = AreaMapper.toPersistence(item);
        await this.updateDoc(COLLECTION_NAME, item.id, data);
    }

    async deleteArea(id: string): Promise<any> {
        await this.deleteDoc(COLLECTION_NAME, id);
    }

    async createArea(item: RestaurantArea): Promise<any> {
        const data = AreaMapper.toPersistence(item);
        await this.saveDoc(COLLECTION_NAME, item.id, data);
    }
}