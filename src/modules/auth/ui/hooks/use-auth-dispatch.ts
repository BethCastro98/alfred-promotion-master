import { useContextSelector } from '@shared/infrastructure/utils/context-selector';
import AuthProviderContext from '@modules/auth/domain/contexts/auth-provider-context';

export default function useAuthDispatch() {
    const dispatch = useContextSelector(
        AuthProviderContext,
        (v) => v.instance.dispatch
    );

    return dispatch
}