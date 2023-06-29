import { useState } from 'react';
import useAuthProvider from './use-auth-provider';
import useAuthDispatch from '@modules/auth/ui/hooks/use-auth-dispatch';

export default function useUpdateIdentity() {
    const authProvider = useAuthProvider();
    const dispatch = useAuthDispatch();
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(true);

    return {
        update: async (user: any) => {
            setLoaded(false);
            setLoading(true);
            try {
                await authProvider.updateIdentity(user);
                dispatch({ type: 'UPDATE_IDENTITY', userData: user });
                setLoaded(true);
                setLoading(false);
            } catch (error) {
                setLoaded(true);
                setLoading(false);
            }
        },
        loading,
        loaded
    };
}
