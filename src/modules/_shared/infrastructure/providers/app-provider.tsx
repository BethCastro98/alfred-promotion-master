import AuthProviderContext from '@modules/auth/domain/contexts/auth-provider-context';
import DataProviderContext from '@modules/_shared/domain/contexts/data-provider-context';
import LocalizationContext from '@modules/_shared/domain/contexts/localization-provider-context';
import NotificationProviderContext from '@modules/_shared/domain/contexts/notification-provider-context';
import ServiceProviderContext from '@modules/_shared/domain/contexts/service-provider-context';
import UtilsProviderContext from '@modules/_shared/domain/contexts/utils-provider-context';
import { AppUtils } from '@modules/_shared/domain/models/app-utils';
import React, { ReactChild, ReactChildren, useEffect, useState } from 'react';
import { Provider as MainComponentsProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from 'react-query';
import { setI18nConfig } from '../services/default-translator';
import LayoutContext from '@modules/_shared/ui/contexts/layout-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StylesProvider } from '@modules/_shared/infrastructure/providers/styles-provider';
import useAuthState from '@modules/auth/ui/hooks/use-auth-state';
import { LocalizationProvider as LocalizationProviderMUI } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

const queryClient = new QueryClient();


interface AppProviderProps {
    children: ReactChild | ReactChildren;
    customRoutes?: any;
    dataProvider: (userTokenId?: string) => object;
    serviceProvider: any;
    // localizationProvider: any;
    authProvider: any;
    theme?: object;
    utilsProvider: AppUtils;
}

export default function AppProvider({
    children,
    theme,
    utilsProvider,
    dataProvider,
    serviceProvider,
    authProvider
}: AppProviderProps) {
    return (
            <QueryClientProvider client={queryClient}>
                <UtilsProviderContext.Provider
                        value={{
                            utils: utilsProvider
                        }}
                >
                    <LocalizationProviderMUI dateAdapter={AdapterMoment}>

                        <StylesProvider theme={theme}>
                            <NotificationProvider>
                                <LayoutProvider>
                                    <AuthProvider value={authProvider}>
                                        <ServiceProviderContext.Provider
                                                value={serviceProvider}
                                        >
                                            <DataProvider value={dataProvider}>
                                                <LocalizationProvider>
                                                    <MainComponentsProvider>
                                                        {children}
                                                    </MainComponentsProvider>
                                                </LocalizationProvider>
                                            </DataProvider>
                                        </ServiceProviderContext.Provider>
                                    </AuthProvider>
                                </LayoutProvider>
                            </NotificationProvider>
                        </StylesProvider>
                    </LocalizationProviderMUI>
                </UtilsProviderContext.Provider>
            </QueryClientProvider>
    );
}


function LayoutProvider({ children }) {
    const [collapsedMenu, setCollapsedMenu] = useState(false);


    async function toggleCollapseMenu(collapse?: boolean) {
        const state = (() => {
            if (collapse !== undefined) {
                return (collapse ? 'COLLAPSED' : 'OPEN');
            }
            return (!collapsedMenu ? 'COLLAPSED' : 'OPEN');
        })();

        const shouldCollapse = state == 'COLLAPSED';

        await AsyncStorage.setItem('MENU_STATE', state);
        setCollapsedMenu(shouldCollapse);
    }

    useEffect(() => {
        (async () => {
            const state = await AsyncStorage.getItem('MENU_STATE');
            if (!state) return;
            setCollapsedMenu(state == 'COLLAPSED');
        })();
    }, []);

    return (
            <LayoutContext.Provider value={{ collapsedMenu, toggleCollapseMenu: toggleCollapseMenu }}>
                {children}
            </LayoutContext.Provider>
    );
}

function AuthProvider({ children, value }) {
    const [state, dispatch] = React.useReducer(
            (prevState: any, action: any) => {
                switch (action.type) {
                    case 'RESTORE_TOKEN':
                        return {
                            ...prevState,
                            isLoggedIn: !!action.token,
                            userToken: action.token
                        };
                    case 'SIGN_IN':
                        return {
                            ...prevState,
                            userToken: action.token,
                            isLoggedIn: true
                        };
                    case 'SIGN_OUT':
                        return {
                            ...prevState,
                            userToken: null,
                            isLoggedIn: false
                        };
                    case 'UPDATE_IDENTITY':
                        return {
                            ...prevState,
                            userData: {
                                ...(prevState.userData || {}),
                                ...action.userData
                            }
                        };
                }
            },
            {
                isLoggedIn: false,
                userToken: null
            }
    );

    value.state = state; //Fix this bad practice
    value.dispatch = dispatch; //Fix this bad practice

    return (
            <AuthProviderContext.Provider
                    value={{
                        instance: value
                    }}
            >
                {children}
            </AuthProviderContext.Provider>
    );
}

function DataProvider({ children, value }) {
    const token = useAuthState((s) => s?.userToken);


    return (
            <DataProviderContext.Provider
                    value={value(token)}
            >
                {children}
            </DataProviderContext.Provider>
    );
}

function NotificationProvider({ children }) {
    const [state, dispatch] = React.useReducer(
            (prevState: any, action: any) => {
                switch (action.type) {
                    case 'SHOW_NOTIFICATION':
                        return {
                            ...prevState,
                            text: action.text,
                            show: true,
                            notificationType: action.notificationType,
                            messageArgs: action.messageArgs,
                            undoable: action.undoable,
                            autoHideDuration: action.autoHideDuration
                        };
                    case 'HIDE_NOTIFICATION':
                        return {
                            ...prevState,
                            text: '',
                            show: false
                        };

                    case 'SHOW_CONFIRM':
                        return {
                            ...prevState,
                            confirm: {
                                ...prevState.confirm,
                                show: true,
                                title: action.title,
                                content: action.content,
                                onConfirm: action.onConfirm,
                                onCancel: action.onCancel,
                                options: action.options
                            }
                        };

                    case 'HIDE_CONFIRM':
                        return {
                            ...prevState,
                            confirm: {
                                ...prevState.confirm,
                                show: false,
                                title: null,
                                content: null
                                /*  onConfirm: null,
                  onCancel: null,
                  options: null, */
                            }
                        };
                }
            },
            {
                isLoggedIn: false,
                userToken: null
            }
    );

    return (
            <NotificationProviderContext.Provider
                    value={{
                        text: state.text,
                        show: state.show,
                        notificationType: state.notificationType,
                        messageArgs: state.messageArgs,
                        undoable: state.undoable,
                        autoHideDuration: state.autoHideDuration,
                        confirm: state.confirm,
                        dispatch,
                        state
                    }}
            >
                {children}
            </NotificationProviderContext.Provider>
    );
}

function LocalizationProvider({ children }) {
    const [locale, setLocale] = useState('en');

    function changeLocale(locale: string) {
        const newSetLocale = setI18nConfig(locale);
        setLocale(newSetLocale);
    }

    return (
            <LocalizationContext.Provider value={{ locale, changeLocale }}>
                {children}
            </LocalizationContext.Provider>
    );
}
