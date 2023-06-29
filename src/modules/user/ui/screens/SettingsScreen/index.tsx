import { Box } from '@main-components/Base/Box';
import AppLayout from '@main-components/Layout/AppLayout';
import ScrollView from '@main-components/Utilities/ScrollView';
import React from 'react';
import Tab from '@mui/material/Tab';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { GeneralSettings } from '@modules/user/ui/screens/SettingsScreen/components/tabs/GeneralSettings';
import TableSchedules from '@modules/user/ui/screens/SettingsScreen/components/tabs/TableSchedules';

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

export default function SettingsScreen() {
    const [value, setValue] = React.useState('general');

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <AppLayout
            title={'Ajustes'}
            loading={false}
            noPadding
        >
            <Box
                flex={1}
                pl={'m'}
                mb={'m'}
                bg={'white'}
                pt={'m'}
            >
                <ScrollView>
                    <TabContext value={value}>
                        <Box mb={'m'}>
                            <TabList
                                onChange={handleChange}
                            >
                                <Tab
                                    label={'Generales'}
                                    value={'general'}
                                    {...a11yProps(0)}
                                />
                                <Tab
                                    label={'Horarios de mesas'}
                                    value={'schedule'} {...a11yProps(1)} />
                            </TabList>
                        </Box>

                        <TabPanel
                            value={'general'}
                        >
                            <GeneralSettings />
                        </TabPanel>

                        <TabPanel
                            value={'schedule'}
                        >
                            <TableSchedules />
                        </TabPanel>
                    </TabContext>
                </ScrollView>
            </Box>
        </AppLayout>
    );
}

