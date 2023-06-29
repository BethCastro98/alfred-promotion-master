import AccountUser from '@modules/user/domain/models/account-user';

export default interface AccountsRepository {
    save(user: AccountUser): Promise<void>;

    remove(id: string): Promise<void>;

    find(id: string): Promise<AccountUser | null>;

    findByEmail(email: string): Promise<AccountUser | null>;

    findAll(): Promise<AccountUser[]>;
}