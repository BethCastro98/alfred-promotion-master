import { useFocusEffect as useBaseFocusEffect } from '@react-navigation/native';
import React from 'react';

export function useFocusEffect(
    subscriptionFn: () => any,
    dependencies: any[] = []
): any {
    useBaseFocusEffect(
        React.useCallback(() => {

            const unsubscribe = subscriptionFn();

            return () => unsubscribe;
        }, dependencies)
    );
}
