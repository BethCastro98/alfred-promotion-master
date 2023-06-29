import FirestoreApiRepository from '@shared/infrastructure/firebase/firestore-api-repository';
import RestaurantMall from '@modules/user/domain/models/restaurant-mall';
import RestaurantMallRepository from '@modules/user/domain/repositories/restaurant-mall-repository';

const COLLECTION_NAME = 'malls';

export default class FirestoreRestaurantMallRepository extends FirestoreApiRepository implements RestaurantMallRepository {

    async findAll(): Promise<RestaurantMall[]> {
        const docs = await this.getDocs(COLLECTION_NAME, {
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


    async find(id: string): Promise<RestaurantMall | null> {
        const doc = await this.getDoc(COLLECTION_NAME, id);
        if (!doc) return null;

        return {
            id: doc.id,
            name: doc.name,
            status: doc.status
        };
    }
}