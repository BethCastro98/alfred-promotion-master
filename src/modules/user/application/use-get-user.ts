import QueryOptions from '@shared/domain/models/query-options';
import useGetOne from '@shared/domain/hooks/resources/use-get-one';
import AccountUser from '@modules/user/domain/models/account-user';
import AccountsRepository from '@modules/user/domain/repositories/accounts-repository';

export default function useGetUser(
    id: string,
    options?: QueryOptions
) {
    return useGetOne<AccountUser | null, AccountsRepository>({
        resource: 'user-profile',
        repository: 'AccountsRepository',
        id: id,
        fn: (repo, ...rest) => repo.find(rest[0]),
        options
    });
}
