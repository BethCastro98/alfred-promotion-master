import { Box } from '@main-components/Base';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BaseAppHeader from '.';

const trialStatus = ['TRIALING', 'ACTIVE', 'INVALID'];
export default {
    title: 'Global/Layout/BaseAppHeader',
    component: null,
    argTypes: {
        currentUser: {
            name: 'currentUser',
            type: { name: 'object', required: false },
            control: {
                type: 'object'
            },
            defaultValue: {
                fullName: 'Eduardo Carvallo',
                profilePictureUrl: null
            },
            description:
                'Current user information. { fullName: "Eduardo Carvallo",  profilePictureUrl: "url"}'
        },
        licenseStatus: {
            name: 'licenseStatus',
            type: { name: 'enum', required: false },
            control: {
                type: 'select',
                options: Object.values(trialStatus), // An array of serializable values
                /*   mapping: trialStatus, */
                labels: {
                    // 'labels' maps option values to string labels
                    TRIALING: 'Trialing',
                    ACTIVE: 'Active',
                    INVALID: 'Invalid'
                }
            },
            defaultValue: 'TRIALING',
            description:
                'Current user information. { fullName: "Eduardo Carvallo",  profilePictureUrl: "url"}'
        }
    },
    decorators: [
        (Story) => {
            return (
                <SafeAreaProvider>
                    <Story />
                </SafeAreaProvider>
            );
        }
    ]
};
export const Basic = (args) => {
    const open = true;
    const DRAWER_WIDTH = 240;
    const width = open ? DRAWER_WIDTH : DRAWER_WIDTH;
    return (
        <Box>
            <BaseAppHeader {...args} />
        </Box>
    );
};

Basic.args = {};
