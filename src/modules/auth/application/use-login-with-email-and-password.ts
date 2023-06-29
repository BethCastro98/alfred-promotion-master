import useNotify from '@shared/domain/hooks/use-notify';
import { useCallback, useState } from 'react';
import useAuthProvider from './use-auth-provider';
import useAuthDispatch from '@modules/auth/ui/hooks/use-auth-dispatch';
import useRepository from '@shared/domain/hooks/use-repository';
import RestaurantRepository from '@modules/user/domain/repositories/restaurant-repository';

type Login = {
    loading: boolean;
    login: (params: any, isGuestUser?: boolean) => Promise<any>;
};

export default function useLoginWithEmailAndPassword(): Login {
    const dispatch = useAuthDispatch();
    const authProvider = useAuthProvider();
    const notify = useNotify();
    const [loading, setLoading] = useState(false);
    const repo = useRepository<RestaurantRepository>('RestaurantRepository');

    const login = useCallback(
        async (params: any = {}, isGuestUser = false) => {
            setLoading(true);

            const loginAccess = {
                ...params
            };

            if (params.slug) {
                const found = await repo.getProfileBySlug(params.slug);
                if (!found) {
                    setLoading(false);
                    notify('Local no encontrado', 'warning');
                    return;
                }

                loginAccess.restaurantId = found.id;
            }

            return authProvider
            .login({
                ...loginAccess,
                isGuestUser
            })
            .then((token) => {
                setLoading(false);
                dispatch({ type: 'SIGN_IN', token: token });
            })
            .catch((e) => {
                if (e.message == 'USER_NOT_FOUND') {
                    notify('Este usuario no está registrado', 'warning');
                    setLoading(false);
                    return;
                }
                setLoading(false);
                notify('No fue posible iniciar sesión.', 'error');
            });
        },
        [authProvider, setLoading]
    );

    const loginWithoutProvider = useCallback((_, __) => {
        return Promise.resolve();
    }, []);

    return {
        login: authProvider ? login : loginWithoutProvider,
        loading
    };
}
