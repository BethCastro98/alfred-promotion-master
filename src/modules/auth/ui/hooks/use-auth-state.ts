import { useContextSelector } from '@shared/infrastructure/utils/context-selector';
import AuthProviderContext from '@modules/auth/domain/contexts/auth-provider-context';

export default function useAuthState(selector) {
    const state = useContextSelector(
        AuthProviderContext,
        (v) => !selector ? v.instance.state : selector?.(v.instance.state)
    );

    return state;
}