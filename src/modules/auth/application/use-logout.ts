import { useCallback, useState } from 'react';
import useAuthProvider from './use-auth-provider';
import useAuthDispatch from '@modules/auth/ui/hooks/use-auth-dispatch';
import useNavigation from '@shared/domain/hooks/navigation/use-navigation';

type Logout = {
    logout: (redirectTo?: string) => Promise<any>;
    loading: boolean;
};

export default function useLogout(): Logout {
    const authProvider = useAuthProvider();
    const dispatch = useAuthDispatch();
    const { navigate } = useNavigation();

    const [loading, setLoading] = useState(false);

    const logout = useCallback(
        (redirectTo = '') => {
            setLoading(true);
            return authProvider
            .logout({})
            .then((redirectToFromProvider) => {
                dispatch({ type: 'SIGN_OUT' });
                return redirectToFromProvider;
            })
            .catch((error) => {
                setLoading(false);
            });
        },
        [authProvider, setLoading, dispatch]
    );

    const logoutWithoutProvider = useCallback((_) => {
        dispatch({ type: 'SIGN_OUT' });

        return Promise.resolve();
    }, []);

    return {
        logout: authProvider ? logout : logoutWithoutProvider,
        loading: loading
    };
}
