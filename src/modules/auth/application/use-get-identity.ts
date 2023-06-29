import { useSafeSetState } from '@shared/domain/hooks/utils-hooks';
import { useEffect } from 'react';
import UserIdentity from '../domain/models/user-identity';
import useAuthProvider from './use-auth-provider';
import useAuthState from '@modules/auth/ui/hooks/use-auth-state';

export default function useGetIdentity() {
    const [state, setState] = useSafeSetState<State>({
        loading: true,
        loaded: false
    });
    const authProvider = useAuthProvider();
    const userData = useAuthState((s) => s?.userData);

    useEffect(() => {
        if (authProvider.getIdentity) {
            const callAuthProvider = async () => {
                try {
                    const identity = await authProvider.getIdentity();
                   
                    setState({
                        loading: false,
                        loaded: true,
                        identity: identity
                    });
                } catch (error) {
                    setState({
                        loading: false,
                        loaded: true,
                        error
                    });
                }
            };
            callAuthProvider();
        } else {
            setState({
                loading: false,
                loaded: true,
                identity: undefined
            });
        }
    }, [setState, userData]);
    return state;
}

interface State {
    loading: boolean;
    loaded: boolean;
    identity?: UserIdentity;
    error?: any;
}
