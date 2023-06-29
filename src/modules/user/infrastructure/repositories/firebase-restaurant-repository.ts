import FirestoreApiRepository from '@shared/infrastructure/firebase/firestore-api-repository';
import RestaurantRepository from '@modules/user/domain/repositories/restaurant-repository';
import Restaurant from '@modules/user/domain/models/restaurant';
import RestaurantMapper from '@modules/user/infrastructure/mappers/restaurant-mapper';
import RestaurantCategory from '@modules/user/domain/models/restaurant-category';

const COLLECTION_NAME = 'restaurants';

export default class FirebaseRestaurantRepository extends FirestoreApiRepository implements RestaurantRepository {
    async getProfileBySlug(slug: string): Promise<Restaurant | undefined> {
        const docs = await this.getDocs(COLLECTION_NAME, { filters: [{ field: 'slug', operator: '==', value: slug }] });

        if (docs.length === 0) return undefined;

        return RestaurantMapper.toDomain(docs[0]);
    }

    async getProfileById(id: string): Promise<Restaurant | undefined> {
        const doc = await this.getDoc(COLLECTION_NAME, id);

        if (!doc) return undefined;

        return RestaurantMapper.toDomain(doc);
    }

    async findCategories(): Promise<RestaurantCategory[]> {
        const docs = await this.getDocs('restaurant-categories', {
            filters: [
                {
                    field: 'status',
                    operator: '==',
                    value: 'ACTIVE'
                }
            ]
        });

        return docs.map(doc => {
            return {
                slug: doc.slug,
                id: doc.id,
                name: doc.name,
                status: doc.status
            };
        });
    }

    async updateRestaurant(restaurant: Restaurant): Promise<any> {
        const data = RestaurantMapper.toPersistence(restaurant);
        await this.updateDoc(COLLECTION_NAME, restaurant.id, data);
    }
}