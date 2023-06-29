import useService from '@shared/domain/hooks/use-service';
import useRepository from '@shared/domain/hooks/use-repository';
import MutationCreator from '@shared/domain/services/mutation-creator';
import Mutation from '@shared/domain/models/mutation';
import AuthUserRepository from '@modules/auth/domain/repositories/auth-user-repository';
import AuthCredentials from '@modules/auth/domain/models/auth-credentials';


export default function useValidateUserCredentials() {

    const repo = useRepository<AuthUserRepository>('AuthUserRepository');
    const mutationCreator = useService<MutationCreator>('MutationCreator');

    const mutation: Mutation = {
        id: 'validate-credentials',
        payload: {},
        type: 'save'
    };

    const [mutate, state] = mutationCreator.execute(
        mutation,
        async ({ credentials }: { credentials: AuthCredentials }) => {

            const response = await repo.validateCredentials(credentials);
            return response;
        }
    );

    return {
        ...state,
        validate: async (credentials: AuthCredentials) => {
            return mutate({
                ...mutation,
                payload: { credentials }
            });
        }
    };
}
