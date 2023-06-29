import Product from '@modules/user/domain/models/product';

export default interface ProductRepository {
    save(item: Product): Promise<void>;

    remove(id: string): Promise<void>;

    find(id: string): Promise<Product | null>;

    findAll(filters: any): Promise<Product[]>;
}