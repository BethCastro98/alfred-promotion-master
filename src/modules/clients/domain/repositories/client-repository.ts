import Client from '@modules/clients/domain/models/client';
import PaginationOptions from '@shared/domain/models/pagination-options';
import SortOptions from '@shared/domain/models/sort-options';

export default interface ClientRepository {
    findClients(
        filter?: any,
        pagination?: PaginationOptions,
        sort?: SortOptions
    ): Promise<Client[]>;

    getClient(
        id: string
    ): Promise<Client | undefined>;

    updateClient(client: Client): Promise<any>;

    createClient(item: Client): Promise<any>;

    deleteClient(id: string): Promise<any>;
}