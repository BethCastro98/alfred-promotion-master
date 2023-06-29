import BaseCollapse from '@mui/material/Collapse';
import React from 'react';
import CollapseProps from './props';

export default function Collapse(props: CollapseProps) {

    return (
        <BaseCollapse
            in={!props.collapsed}
            timeout={props.timeout ?? 'auto'}
            unmountOnExit
        >
            {props.children}
        </BaseCollapse>
    );
}
