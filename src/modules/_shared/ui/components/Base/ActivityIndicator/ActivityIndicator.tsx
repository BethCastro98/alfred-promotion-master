import { useTheme } from '@modules/_shared/ui/theme/AppTheme';
import React from 'react';
import { ActivityIndicator as BaseActivityIndicator } from 'react-native-paper';
import { ActivityIndicatorProps } from './ActivityIndicatorProps';

export function ActivityIndicator(props: ActivityIndicatorProps) {
    const theme = useTheme();

    return (
        <BaseActivityIndicator
            size={20}
            {...props}
            color={theme.colors[props.color ?? 'primaryMain']}
        />
    );
}
