import useService from '@shared/domain/hooks/use-service';
import MutationCreator from '@shared/domain/services/mutation-creator';
import Mutation from '@shared/domain/models/mutation';
import useAuthProvider from '@modules/auth/application/use-auth-provider';
import AccountUser from '@modules/user/domain/models/account-user';
import useSaveUser from '@modules/user/application/accounts/use-save-user';

export default function useUpdatePassword() {
    const mutationCreator = useService<MutationCreator>('MutationCreator');

    const mutation: Mutation = {
        id: 'user-profile',
        payload: {},
        type: 'delete'
    };
    const authProvider = useAuthProvider();
    const { execute: saveUser, loading: saving } = useSaveUser();

    const [mutate, state] = mutationCreator.execute(
        mutation,
        async ({
            user,
            email,
            oldPassword,
            password
        }: { user: AccountUser, email: string, oldPassword: string, password: string }) => {
            try {
                await authProvider
                .changePassword({
                    email: email,
                    oldPassword: oldPassword,
                    password: password
                });

                user.setCustomPasswordConfigured();
                await saveUser(user);
            } catch (e) {
                throw  new Error(e.message);
            }
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
        execute: async (user: AccountUser, email: string, oldPassword: string, password: string) => {
            return mutate({
                ...mutation,
                payload: {
                    user: user,
                    email: email,
                    oldPassword: oldPassword,
                    password: password
                }
            });
        },
        loading: state.loading || saving,
        loaded: state.loaded,
        data: null
    };
}
