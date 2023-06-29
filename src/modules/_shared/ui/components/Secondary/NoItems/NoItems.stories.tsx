import React from 'react';
import NoItems from '.';

export default {
    title: 'Global/Secondary/NoItems',
    component: NoItems,
    argTypes: {}
};

export const Basic = (args) => <NoItems {...args} />;

Basic.args = {};
