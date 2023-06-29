import useAuthProvider from '@modules/auth/application/use-auth-provider';
import { useEffect, useState } from 'react';
import useAuthDispatch from '@modules/auth/ui/hooks/use-auth-dispatch';

export default function useRestoreSession() {
    const dispatch = useAuthDispatch();
    const authProvider = useAuthProvider();
    const [loading, setLoading] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);

            try {
                const userWelcomed = await authProvider.isUserWelcomed();
                setShowWelcome(!userWelcomed);
            } catch (e) {
            }

            try {
                const token = await authProvider.checkAuth({});
                const userData = await authProvider.getIdentity();

                dispatch({
                    type: 'RESTORE_TOKEN',
                    token: token?.id,
                    ...(authProvider.getIdentity && {
                        userData: userData?.toPrimitives()
                    })
                });

                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        })();
    }, [authProvider.getIdentity, authProvider.isUserWelcomed]);

    return {
        showWelcome,
        loading
    };
}
