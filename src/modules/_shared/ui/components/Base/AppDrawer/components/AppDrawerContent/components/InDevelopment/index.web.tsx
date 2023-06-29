import {Box} from '@main-components/Base/Box';
import {Icon} from '@main-components/Base/Icon';
import Text from '@main-components/Typography/Text';
import React from 'react';
import AppLayout from "@main-components/Layout/AppLayout/AppLayout.web";
import useNavigation from "@modules/_shared/domain/hooks/navigation/use-navigation";

export default function InDevelopment() {
    const navigation = useNavigation()
    return (
        <AppLayout navigation={navigation}>
            <Box
                flex={1}
                justifyContent={'center'}
                alignItems={'center'}
            >
                <Box mb="m">
                    <Icon
                        name={'exclamation-triangle'}
                        numberSize={50}
                        color={'primaryMain'}
                    />
                </Box>
                <Text
                    color={'primaryMain'}
                    variant="heading1"
                >
                    In development
                </Text>
            </Box>
        </AppLayout>
    );
}
