import {Box} from '@main-components/Base/Box';
import {Icon} from '@main-components/Base/Icon';
import Text from '@main-components/Typography/Text';
import React from 'react';

export default function InDevelopment() {
    return (
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
    );
}
