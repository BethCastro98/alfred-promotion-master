import { Box } from '@main-components/Base/Box';
import { DropdownMenu } from '@main-components/Base/Dropdown/Dropdown.web';
import { IconButton } from '@main-components/Base/IconButton';
import { Image } from '@main-components/Base/Image';
import Header from '@main-components/Layout/Header';
import Text from '@main-components/Typography/Text';

import { useAppLayout } from '@modules/_shared/ui/hooks/use-app-layout';
import { useTheme } from '@modules/_shared/ui/theme/AppTheme';
import React from 'react';
import BaseAppHeaderProps from './BaseAppHeaderProps';
import { useUtils } from '@shared/domain/hooks/use-utils';

export default function BaseAppHeader(props: BaseAppHeaderProps) {
    const theme = useTheme();
    const toggleCollapseMenu = useAppLayout((values) => values.toggleCollapseMenu);

    return (
            <Header
                    style={{
                        border: 0,
                        backgroundColor: props.backgroundColor ?? 'transparent',
                        height: 80,
                        paddingHorizontal: 20
                        /*  boxShadow: '5px 5px 10px #eceff1'*/
                    }}
                    rightContainerStyle={{
                        flexBasis: 140
                    }}
                    leftComponent={
                        <Box
                                flexDirection={'row'}
                                flex={1}
                        >

                            {/*   <Box
                        width={40}
                        height='100%'
                        alignItems='center'
                        justifyContent='center'
                    >
                        <TouchableOpacity
                            onPress={() => {
                                toggleCollapseMenu();
                                //  props.navigation?.toggleDrawer();
                            }}
                        >
                            <Icon
                                name='bars'
                                color='primaryMain'
                            />
                        </TouchableOpacity>

                    </Box>*/}
                            {
                                    !!props.title && (
                                            <Box
                                                    top={57}
                                                    flex={1}
                                            >
                                                <Text
                                                        bold
                                                        variant={'heading1'}
                                                >{props.title}</Text>
                                            </Box>
                                    )
                            }
                        </Box>
                    }
                    centerContainerStyle={{
                        flex: 0
                    }}
                    rightComponent={
                        <Box
                                flex={0.5}
                                flexBasis={140}
                                flexDirection='row'
                        >

                            {/*    <HeaderProfileSection
                                    navigation={props.navigation}
                                    currentUser={props.currentUser}
                                    licenseStatus={props.licenseStatus ?? 'ACTIVE'}
                            />*/}
                        </Box>
                    }
            />
    );
}

function HeaderProfileSection(props: {
    currentUser?: {
        profilePictureUrl?: string;
        fullName: string;
    };
    navigation?: any
}) {
    return (
            <Box flexDirection='row'>
                <Box
                        justifyContent='center'
                        alignItems='center'
                        ml='m'
                >
                    <IconButton
                            backgroundColor={'white'}
                            borderRadius={45 / 2}
                            onPress={() => {
                            }}
                            iconColor='greyMain'
                            iconSize={20}
                            containerSize={45}
                            iconType={'app'}
                            iconName={'location-pin-1'}
                    />
                </Box>

                <Box
                        justifyContent='center'
                        alignItems='center'
                        ml='m'
                >
                    <IconButton
                            backgroundColor={'white'}
                            borderRadius={45 / 2}
                            onPress={() => {
                            }}
                            iconColor='greyMain'
                            iconSize={20}
                            containerSize={45}
                            iconType={'app'}
                            iconName={'support'}
                    />
                </Box>

                <Box
                        justifyContent='center'
                        alignItems='center'
                        ml='m'
                >
                    <IconButton
                            backgroundColor={'white'}
                            borderRadius={45 / 2}
                            onPress={() => {
                            }}
                            iconColor='greyMain'
                            iconSize={20}
                            containerSize={45}
                            iconName={'bell'}
                    />
                </Box>

                <Box
                        justifyContent='center'
                        alignItems='center'
                        ml='l'
                        borderLeftWidth={1}
                        borderLeftColor={'greyMedium'}
                        paddingLeft={'m'}
                >
                    <DropdownMenu
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center'
                            }}
                            AnchorComponent={
                                <Box style={{ cursor: 'pointer' }}>
                                    <UserHeaderProfile
                                            profilePictureUrl={
                                                props.currentUser?.profilePictureUrl
                                            }
                                            fullName={props.currentUser?.fullName ?? ''}
                                    />
                                </Box>
                            }
                            options={[
                                {
                                    label: 'Settings',
                                    onClick: () => {
                                        props.navigation.navigate('Configurations');
                                    }
                                }
                            ]}
                    />
                </Box>
            </Box>
    );
}

function UserHeaderProfile({
    profilePictureUrl,
    fullName
}: {
    profilePictureUrl?: string;
    fullName: string;
}) {

    const { date: DateUtils } = useUtils();

    return (
            <Box
                    flexDirection='row'
                    alignItems='center'
            >
                <Box
                        mr='m'
                        flex={1}

                >
                    <Box mb={'xs'}>
                        <Text
                                variant={'small'}
                                align={'right'}
                                color={'greyMain'}
                                numberOfLines={1}
                        >Buenos días</Text>
                    </Box>
                    <Box>
                        <Text
                                variant={'heading3'}
                                align={'right'}
                                numberOfLines={1}
                        >{fullName}</Text>
                    </Box>
                </Box>
                <Box
                        borderRadius={60 / 2}
                        borderWidth={1}
                        borderColor='greyMedium'
                        width={60}
                        height={60}
                        justifyContent='center'
                        alignItems='center'
                >
                    <Image
                            source={
                                { uri: profilePictureUrl }
                            }
                            style={{
                                width: 60,
                                height: 60,
                                resizeMode: 'cover',
                                borderRadius: 60 / 2
                            }}
                    />
                </Box>

            </Box>
    );
}
