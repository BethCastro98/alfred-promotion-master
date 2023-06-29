import Promotion from '@modules/user/domain/models/promotion';

export default interface PromotionRepository {
    save(item: Promotion): Promise<void>;

    remove(id: string): Promise<void>;

    find(id: string): Promise<Promotion | null>;

    findAll(filters: any): Promise<Promotion[]>;
}