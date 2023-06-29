import MutationCreator from '@shared/domain/services/mutation-creator';
import useService from '@shared/domain/hooks/use-service';
import useRepository from '@shared/domain/hooks/use-repository';
import Mutation from '@shared/domain/models/mutation';
import AccountUser from '@modules/user/domain/models/account-user';
import AccountsRepository from '@modules/user/domain/repositories/accounts-repository';

export default function useSaveUser() {

    const repo = useRepository<AccountsRepository>('AccountsRepository');
    const mutationCreator = useService<MutationCreator>('MutationCreator');

    const mutation: Mutation = {
        id: 'users',
        payload: {},
        type: 'save'
    };

    const [mutate, state] = mutationCreator.execute(
        mutation,
        async ({ entity }: { entity: AccountUser }) => {
            await repo.save(entity);
        },
        {
            onFailure: () => {

            },
            onSuccess: async (response, queryClient) => {
                await queryClient.invalidateQueries({
                    predicate: (query) => {
                        const queryKey: any = query.queryKey[0];
                        return [mutation.id]
                        .map((i) => i)
                        .includes(queryKey.id);
                    }
                });
            }
        }
    );

    return {
        execute: async (entity: AccountUser) => {
            return mutate({
                ...mutation,
                payload: {
                    entity: entity
                }
            });
        },
        loading: state.loading,
        loaded: state.loaded,
        data: null
    };

}
