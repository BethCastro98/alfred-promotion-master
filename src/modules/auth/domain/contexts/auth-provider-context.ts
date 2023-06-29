import createContext from '@shared/infrastructure/utils/context-selector';

const AuthProviderContext = createContext<any>(
    //@ts-ignore
    null
);

AuthProviderContext.displayName = 'AuthProviderContext';

export default AuthProviderContext;
