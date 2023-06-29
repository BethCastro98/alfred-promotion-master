import Text from '@main-components/Typography/Text';
import React from 'react';
import { LinkProps } from './LinkProps';
import { Link as BaseLink } from 'expo-router';

export function Link(props: LinkProps) {

    return (
        <BaseLink
            href={props.href}
            target={props.target}
            hrefAttrs={{
                target: props.target
            }}
        >
            <Text color={props.textColor ?? 'primaryMain'} {...props.textProps}>
                {props.label}
            </Text>
        </BaseLink>
    );
}
