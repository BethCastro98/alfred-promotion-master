import FirestoreApiRepository from '@shared/infrastructure/firebase/firestore-api-repository';
import ClientRepository from '@modules/clients/domain/repositories/client-repository';
import Client from '@modules/clients/domain/models/client';
import PaginationOptions from '@modules/_shared/domain/models/pagination-options';
import SortOptions from '@shared/domain/models/sort-options';
import { getLoggedInUserSession } from '@modules/auth/infrastructure/providers/app-auth-provider';
import { getDocs } from 'firebase/firestore';
import ClientMapper from '@modules/clients/infrastructure/mappers/client-mapper';

const COLLECTION_NAME = 'clients';

export default class FirebaseClientRepository extends FirestoreApiRepository implements ClientRepository {

    async findClients(
        filter?: any,
        pagination?: PaginationOptions,
        sort?: SortOptions
    ): Promise<Client[]> {
        const restaurantId = (await getLoggedInUserSession())?.restaurantId;
        if (!restaurantId) return Promise.resolve([]);

        const ref = await FirebaseClientRepository.applyPagination(COLLECTION_NAME, this.getQueryConstraints({
            filters: [
                {
                    field: 'status',
                    operator: '==',
                    value: 'ACTIVE'
                },
                {
                    field: 'restaurantId',
                    operator: '==',
                    value: restaurantId
                },
                ...(filter?.q ? [{
                    field: 'email',
                    operator: '==' as any,
                    value: filter.q
                }] : [])]
        }), pagination);

        const dtos = (await getDocs(ref)).docs.map(d => d.data());

        if (dtos.length == 0) {
            return [];
        }

        return ClientMapper.toDomainFromArray(dtos);
    }

    async updateClient(client: Client): Promise<any> {
        const data = ClientMapper.toPersistence(client);
        await this.updateDoc(COLLECTION_NAME, client.id, data);
    }

    async deleteClient(id: string): Promise<any> {
        return this.updateDoc(COLLECTION_NAME, id, {
            status: 'DELETED'
        });
    }

    async getClient(id: string): Promise<Client | undefined> {
        const doc = await this.getDoc(COLLECTION_NAME, id);
        if (!doc) return undefined;

        return ClientMapper.toDomain(doc);
    }

    async createClient(item: Client): Promise<any> {
        const data = ClientMapper.toPersistence(item);
        await this.saveDoc(COLLECTION_NAME, item.id, data);
    }
}