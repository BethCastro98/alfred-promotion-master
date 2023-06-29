import AuthProvider from '@modules/auth/domain/services/auth-provider';
import useAuthProvider from '@modules/auth/application/use-auth-provider';
import { useState } from 'react';

export function useCheckIdentity() {
    const authProvider: AuthProvider = useAuthProvider();
    const [loading, setLoading] = useState(false);

    return {
        async execute(params) {
            setLoading(true);

            await authProvider?.checkIdentity({
                phone: params.phone,
                email: params.email
            }).finally(() => {
                setLoading(false);
            });
        },
        loading
    };
}