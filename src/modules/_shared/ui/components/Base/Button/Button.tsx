import ArrayUtils from '@modules/_shared/domain/utils/misc/array-utils';
import { useTheme } from '@modules/_shared/ui/theme/AppTheme';
import React from 'react';
import { Platform, StyleProp, ViewStyle } from 'react-native';
import { Button as BaseButton } from 'react-native-paper';
import { ButtonProps } from './ButtonProps';

export function Button({
    onPress,
    title,
    borderRadius = 's',
    size = 'm',
    titleColor = 'primaryContrastText',
    loading = false,
    backgroundColor = 'primaryMain',
    icon,
    raised = false,
    block = false,
    style,
    mode = 'contained',
    disabled = false,
    uppercase = false,
    compact = false,
    contentStyle,
    flat = true
}: ButtonProps) {
    const theme = useTheme();

    const shouldDisable = disabled || loading;

    const sizes: {
        [size: string]: {
            height: string | number;
            fontSize: number;
            lineHeight: number;
        };
    } = {
        s: {
            height: 30,
            fontSize: 10,
            lineHeight: 10
        },
        m: {
            height: 40,
            fontSize: 14,
            lineHeight: 14
        },
        l: {
            height: 55,
            fontSize: 16,
            lineHeight: 16
        }
    };

    const buttonStyles: StyleProp<ViewStyle> | any = {
        elevation: mode == 'contained' && raised ? 20 : undefined,
        borderRadius: borderRadius ? theme.borderRadius[borderRadius] : 0,
        backgroundColor: disabled
                ? theme.colors[backgroundColor]
                : mode !== 'text'
                        ? theme.colors[backgroundColor]
                        : 'transparent',
        boxShadow: mode === 'text' ? 'none' : undefined,
        width: block ? '100%' : Platform.select({
            web: 'fit-content',
            default: undefined
        })
    };

    return (
            <BaseButton
                    loading={loading}
                    onPress={onPress}
                    mode={mode !== 'action' ? mode : 'contained'}
                    disabled={shouldDisable}
                    color={theme.colors[backgroundColor]}
                    compact={compact}
                    icon={icon}
                    contentStyle={[
                        {
                            height: block ? sizes[size].height : sizes[size].height
                        },
                        contentStyle ?? {}
                    ]}
                    style={[
                        buttonStyles,
                        ...(style ? (ArrayUtils.isArray(style) ? style : [style]) : []),

                        [
                            {
                                elevation: flat ? 0 : undefined,
                                opacity: shouldDisable ? 0.5 : 1
                            }
                        ]

                    ]}
                    labelStyle={{
                        color:
                                mode == 'contained'
                                        ? theme.colors[titleColor]
                                        : mode == 'text'
                                                ? theme.colors[titleColor] ||
                                                theme.colors[backgroundColor]
                                                : undefined,
                        fontSize: sizes[size].fontSize,
                        textTransform: uppercase ? 'uppercase' : 'initial',
                        alignItems: 'center',
                        fontFamily: theme.textVariants.body.fontFamily
                    }}
            >
                {title}
            </BaseButton>
    );
}
