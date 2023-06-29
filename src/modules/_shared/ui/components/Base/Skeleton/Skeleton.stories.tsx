import React from 'react';
import { Skeleton } from '.';

export default {
    title: 'Global/Base/Skeleton',
    component: Skeleton,
    argTypes: {}
};

export const Basic = (args) => <Skeleton {...args} />;

Basic.args = {};
