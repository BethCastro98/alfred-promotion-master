import useAuthProvider from '@modules/auth/application/use-auth-provider';
import { useEffect, useState } from 'react';
import useAuthState from '@modules/auth/ui/hooks/use-auth-state';

export default function useIsLoggedIn() {
    const [loading, setLoading] = useState(true);
    const [hasToken, setHasToken] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const authProvider = useAuthProvider();

    const isLoggedIn = useAuthState((s) => s.isLoggedIn);

    useEffect(() => {
        (async () => {
            try {
                const token = await authProvider.checkAuth({});
                setLoading(false);
                setHasToken(!!token);
                setUserId(token?.id);
            } catch (error) {
                setLoading(false);
                setHasToken(false);
                setUserId(null);
            }
        })();
    }, [isLoggedIn]);

    return { loading, isLoggedIn: hasToken, userId };
}

export function useIsAuthenticated() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const isLoggedIn = useAuthState((s) => s.isLoggedIn);

    useEffect(() => {
        setIsAuthenticated(isLoggedIn);
    }, [isLoggedIn]);

    return {
        isAuthenticated
    };
}