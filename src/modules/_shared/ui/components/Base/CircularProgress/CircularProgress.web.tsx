import theme, { useTheme } from '@modules/_shared/ui/theme/AppTheme';
import React from 'react';
import { Box, CircularProgressProps } from '@main-components/Base';
import BaseCircularProgress from '@mui/material/CircularProgress';
import Text from '@main-components/Typography/Text';
import styled from 'styled-components';

const CustomCircularProgress: BaseCircularProgress = styled(BaseCircularProgress)`
  color: ${theme.colors.secondaryMain};
  position: absolute;
  z-index: 9999;
`;

const BottomCircularProgress: BaseCircularProgress = styled(BaseCircularProgress)`
  color: ${theme.colors.greyLight}
`;

export function CircularProgress(props: CircularProgressProps) {
    const theme = useTheme();

    return (
        <Box
            position='relative'
            display='inline-flex'
            width={props.radius * 2}
            height={props.radius * 2}
        >

            <CustomCircularProgress
                variant='determinate'
                value={props.value}
                size={props.radius * 2}
            />

            <BottomCircularProgress
                variant='determinate'
                value={'100'}
                size={props.radius * 2}
            />

            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position='absolute'
                display='flex'
                alignItems='center'
                justifyContent='center'
            >
                <Text
                    color={'secondaryMain'}
                    {...(props.textProps ?? {})}
                >{`${Math.round(
                    props.value
                )}%`}</Text>
            </Box>
        </Box>
    );
}
