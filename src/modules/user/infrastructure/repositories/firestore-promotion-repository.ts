import FirestoreApiRepository from '@shared/infrastructure/firebase/firestore-api-repository';
import PromotionRepository from '@modules/user/domain/repositories/promotion-repository';
import Promotion from '@modules/user/domain/models/promotion';
import PromotionMapper from '@modules/user/infrastructure/mappers/promotion-mapper';
import { getLoggedInUserSession } from '@modules/auth/infrastructure/providers/app-auth-provider';

const COLLECTION_NAME = 'promotions';

export default class FirestorePromotionRepository extends FirestoreApiRepository implements PromotionRepository {

    async findAll(filters?: any): Promise<Promotion[]> {
        const restaurantId = (await getLoggedInUserSession())?.restaurantId;
        if (!restaurantId) return Promise.resolve([]);

        const defaultFilters = [
            {
                field: 'status',
                operator: '==',
                value: 'ACTIVE'
            },
            {
                field: 'restaurantId',
                operator: '==',
                value: restaurantId
            }
        ];

        if (filters?.mallId) {
            defaultFilters.push({
                field: 'mallsIds',
                operator: 'array-contains',
                value: filters.mallId
            });
        }

        if (filters?.availability) {
            if (filters.availability !== 'ALL') {
                defaultFilters.push({
                    field: 'available',
                    operator: '==',
                    value: filters.availability == 'AVAILABLE'
                });
            }
        }

        const docs = await this.getDocs(COLLECTION_NAME, {
            filters: defaultFilters
        });

        return PromotionMapper.toDomainFromArray(docs);
    }

    remove(id: string): Promise<void> {
        return this.updateDoc(COLLECTION_NAME, id, {
            status: 'DELETED'
        });
    }

    async save(item: Promotion): Promise<void> {
        const dto = PromotionMapper.toPersistence(item);
        return this.saveDoc(COLLECTION_NAME, item.id, dto);
    }

    async find(id: string): Promise<Promotion | null> {

        const docs = await this.getDocs(COLLECTION_NAME, {
            filters: [
                {
                    field: 'status',
                    operator: '==',
                    value: 'ACTIVE'
                },
                {
                    field: 'id',
                    operator: '==',
                    value: id
                }
            ],
            limit: 1
        });

        if (docs.length == 0) return null;

        return PromotionMapper.toDomain(docs[0]);
    }
}