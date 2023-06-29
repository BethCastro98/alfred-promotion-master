import { Box } from '@main-components/Base/Box';
import { Image } from '@main-components/Base/Image';
import useLogout from '@modules/auth/application/use-logout';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import React from 'react';
import DrawerContentContainer from './components/DrawerContentContainer/index.web';
import DrawerItem from './components/DrawerItem';
import MenuItemsList from './components/MenuItemsList/index.web';
import AppIcon from '@main-components/Base/AppIcon';
import { useTheme } from '@shared/ui/theme/AppTheme';
import Text from '@main-components/Typography/Text';
import { FOOTER_HEIGHT } from '../../../../../../../../../app/(authenticated)/(menu)/_layout';

export default function AppDrawerContent(props: DrawerContentComponentProps & { collapsed?: boolean, name?: string; logoUrl?: string }) {
    const { logout } = useLogout();
    const theme = useTheme();

    return (
            <DrawerContentContainer
                    scrollbar={{
                        color: 'rgba(0,0,0,0.4)',
                        hoverColor: 'rgba(0,0,0,0.6)'
                    }}
            >

                <Box
                        justifyContent={'center'}
                        alignItems={'center'}
                        p='s'
                        bg={'primaryMain'}
                >
                    {
                        props.collapsed ? (
                                <Box />
                        ) : (
                                <Box
                                        width={'100%'}
                                        alignItems={'center'}
                                        flexDirection={'row'}
                                        justifyContent={'space-between'}
                                >
                                    <Box
                                            mr={'m'}
                                            width={74}
                                    >
                                        <Box
                                                style={{
                                                    width: 74,
                                                    height: 74,
                                                    borderRadius: 74 / 2
                                                }}
                                        >
                                            <Image
                                                    source={props.logoUrl}
                                                    style={{
                                                        width: 74,
                                                        height: 74,
                                                        borderRadius: 74 / 2,
                                                        resizeMode: 'contain'
                                                    }}
                                            />
                                        </Box>
                                    </Box>
                                    <Box flex={1}>
                                        <Text
                                                color={'white'}
                                                numberOfLines={2}
                                        >{props.name}</Text>
                                    </Box>
                                </Box>

                        )
                    }

                </Box>


                <Box
                        flex={1}
                        pt={'m'}
                >
                    <MenuItemsList {...props} />
                </Box>

                <Division />

                <Box
                        style={{
                            paddingBottom: FOOTER_HEIGHT + 10
                        }}
                >
                    <DrawerItem
                            key={'logout'}
                            icon={(props) => (
                                    <AppIcon
                                            color={props.color ?? 'white'}
                                            size={20}
                                            name='log-out'
                                    />
                            )}
                            label='Cerrar sesión'
                            onPress={async () => {
                                await logout();
                            }}
                    />
                </Box>

            </DrawerContentContainer>
    );
}

function Division() {
    return (
            <Box
                    mb='s'
                    borderBottomWidth={1.5}
            />
    );
}
