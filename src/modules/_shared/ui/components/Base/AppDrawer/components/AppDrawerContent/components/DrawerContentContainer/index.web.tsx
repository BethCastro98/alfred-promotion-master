import React from 'react';
import { Box } from '@main-components/Base/Box';
import { useTheme } from '@shared/ui/theme/AppTheme';

export default function DrawerContentContainer(props) {
    const theme = useTheme();

    return (
            <ScrollbarWrapper {...props}>
                <Box
                        style={{
                            backgroundImage: `linear-gradient(${theme.colors.contrastMain},${theme.colors.contrastLight}) `
                        }}
                        flex={1}
                >{props.children}</Box>
            </ScrollbarWrapper>
    );
}

//@ts-ignore
function ScrollbarWrapper(props) {
    return (
            <Box
                    flex={1}
                    style={{
                        /*   overflowY: 'auto',
                           scrollbarColor: 'white red',
                           '::-webkit-scrollbar': {
                               width: '8px'
                           },
                           '::-webkit-scrollbar-track': {
                               boxShadow: 'nset 0 0 6px grey',
                               borderRadius: '5px'
                           },
                           '::-webkit-scrollbar-thumb': {
                               background: `${props.scrollbar.color}`,
                               borderRadius: '15px',
                               height: '2px'
                           },
                           '::-webkit-scrollbar-thumb:hover': {
                               background: `${props.scrollbar.hoverColor}`,
                               maxHeight: '10px'
                           }*/
                    }}
            >
                {props.children}
            </Box>
    );
}

