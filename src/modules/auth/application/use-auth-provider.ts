import { useContextSelector } from '@shared/infrastructure/utils/context-selector';
import AuthProviderContext from '../domain/contexts/auth-provider-context';
import AuthProvider from '@modules/auth/domain/services/auth-provider';

/**
 * Get the authProvider stored in the context
 */
export default function useAuthProvider(): AuthProvider {
    const defaultSelector = (v) => {
        return v.instance;
    };

    return useContextSelector(AuthProviderContext, defaultSelector);

}
