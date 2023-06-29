import useService from '@shared/domain/hooks/use-service';
import UseQueryValue from '@shared/domain/models/use-query-value';
import QueryCreator from '@shared/domain/services/query-creator';
import useRepository from '@shared/domain/hooks/use-repository';
import QueryOptions from '@shared/domain/models/query-options';
import AccountUser from '@modules/user/domain/models/account-user';
import AccountsRepository from '@modules/user/domain/repositories/accounts-repository';


type ResponseQueryValue = Omit<UseQueryValue, 'data'> & {
    data?: AccountUser;
};

export default function useFindUser(id: string, options?: QueryOptions): ResponseQueryValue {
    const repo = useRepository<AccountsRepository>(
        'AccountsRepository'
    );
    const queryCreator = useService<QueryCreator>('QueryCreator');

    const queryState: ResponseQueryValue = queryCreator.execute(
        {
            id: 'users',
            payload: {},
            type: 'get'
        },
        () => repo.find(id),
        {
            ...options ?? {}
        }
    );

    return queryState;
}
