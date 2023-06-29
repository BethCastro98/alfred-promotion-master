import { useTheme } from '@modules/_shared/ui/theme/AppTheme';
import Text from '@main-components/Typography/Text';
import TouchableOpacity from '@main-components/Utilities/TouchableOpacity';
import React from 'react';
import { Box } from '@main-components/Base/Box';
import { Icon } from '@main-components/Base/Icon';

export default function DrawerItem({ collapsed = false, ...props }: {
    onPress?: any;
    style?: any;
    icon?: any;
    label?: string;
    open?: boolean;
    isSubmenu?: boolean;
    collapsed?: boolean
}) {
    const theme = useTheme();
    const showChevron = props.isSubmenu && !collapsed;

    return (
            <TouchableOpacity
                    style={{
                        width: '100%',
                        paddingLeft: 10,
                        paddingVertical: 5
                    }}
                    onPress={props.onPress}
            >
                <Box
                        p='s'
                        alignItems='center'
                        flexDirection='row'
                        style={{
                            ...props.style,
                            borderRadius: 0,
                            borderTopLeftRadius: 20,
                            borderBottomLeftRadius: 20,
                            width: '100%', ...(collapsed && {
                                justifyContent: 'center'
                            })
                        }}
                >
                    <IconContainer collapsed={collapsed}>
                        {props.icon?.({ color: props.style?.color ?? 'white', size: collapsed ? 30 : 24 })}
                    </IconContainer>
                    {
                            !collapsed && (
                                    <LabelContainer style={props?.labelStyle}>
                                        <Text
                                                bold={props?.style?.bold}
                                                color={props.style?.color ?? 'white'}
                                        >{props.label}</Text>
                                    </LabelContainer>
                            )
                    }

                    {
                            showChevron && (
                                    <Box
                                            flexDirection='row'
                                            justifyContent='flex-end'
                                            alignItems='center'
                                    >
                                        <Icon
                                                color={props.style?.color ?? 'white'}
                                                name={props.open ? 'chevron-down' : 'chevron-right'}
                                                numberSize={16}
                                        />
                                    </Box>
                            )
                    }
                </Box>
            </TouchableOpacity>
    );
}

function IconContainer({ children, collapsed }) {
    return (
            <Box
                    justifyContent='center'
                    alignItems='center'
                    width={24}
                    style={{ marginRight: collapsed ? 0 : 32 }}
            >
                {children}
            </Box>
    );
}

function LabelContainer({ children, style }) {
    return (
            <Box
                    style={style}
                    flex={1}
            >
                {children}
            </Box>
    );
}