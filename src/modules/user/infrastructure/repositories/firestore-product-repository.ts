import FirestoreApiRepository from '@shared/infrastructure/firebase/firestore-api-repository';
import ProductRepository from '@modules/user/domain/repositories/product-repository';
import Product from '@modules/user/domain/models/product';
import ProductMapper from '@modules/user/infrastructure/mappers/product-mapper';
import { getLoggedInUserSession } from '@modules/auth/infrastructure/providers/app-auth-provider';

const COLLECTION_NAME = 'products';

export default class FirestoreProductRepository extends FirestoreApiRepository implements ProductRepository {

    async findAll(filters?: any): Promise<Product[]> {
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

        return ProductMapper.toDomainFromArray(docs);
    }

    remove(id: string): Promise<void> {
        return this.updateDoc(COLLECTION_NAME, id, {
            status: 'DELETED'
        });
    }

    async save(item: Product): Promise<void> {
        const dto = ProductMapper.toPersistence(item);
        return this.saveDoc(COLLECTION_NAME, item.id, dto);
    }

    async find(id: string): Promise<Product | null> {

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

        return ProductMapper.toDomain(docs[0]);
    }
}