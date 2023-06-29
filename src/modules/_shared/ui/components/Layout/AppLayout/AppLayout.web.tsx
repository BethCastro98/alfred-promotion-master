import { Box } from '@main-components/Base/Box';
import { useAppLayout } from '@modules/_shared/ui/hooks/use-app-layout';
import React from 'react';
import { Theme, useTheme } from '@modules/_shared/ui/theme/AppTheme';
import { CLOSED_DRAWER_WIDTH, DRAWER_WIDTH } from '@main-components/Layout/AppLayout/drawer-constants';
import BaseAppHeader from '@main-components/Layout/BaseAppHeader/BaseAppHeader.web';
import { ProgressBar } from '@main-components/Base/ProgressBar';


interface AppLayoutProps {
    children: JSX.Element;
    bg?: keyof Theme['colors'];
    title?: string;
    loading?: boolean;
    headerBgColor?: string;
    LoadingComponent?: JSX.Element;
    noPadding?: boolean;
}

export default function AppLayout(props: AppLayoutProps) {
    const collapsed = useAppLayout((values) => values.collapsedMenu);
    const width = !collapsed ? DRAWER_WIDTH : CLOSED_DRAWER_WIDTH;
    const theme = useTheme();

    // useUpdateNavigationTitle(props.title ?? '');

    return (

            <Box
                    testID={'app-layout'}
                    bg={'white'}
                    style={{
                        backgroundColor: props.bg ? theme.colors[props.bg] : theme.colors.greyLightest,
                        paddingBottom: 0 /* Trial bar */,
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1
                    }}
            >

                <AppHeaderController
                        title={props.title}
                        backgroundColor={props.headerBgColor ?? 'white'}
                />
                <Box
                        style={{
                            opacity: props.loading ? 1 : 0
                        }}
                >
                    <ProgressBar
                            borderRadius={0}
                            progress={100}
                            indeterminate
                    />
                </Box>


                <Box
                        flex={1}
                        height='100%'
                        {...!props.noPadding && {
                            padding: 's',
                            style: {
                                paddingHorizontal: 20
                            }
                        }}

                        bg={props.bg ?? 'white'}
                >
                    {props.children}
                </Box>
            </Box>
    );
}

function AppHeaderController(props: { backgroundColor?: string; navigation: any, title?: string }) {

    return (
            <BaseAppHeader
                    title={props.title}
                    backgroundColor={props.backgroundColor}
                    navigation={props.navigation}
                    currentUser={{
                        fullName: '',
                        profilePictureUrl: undefined
                    }}
            />
    );
}
