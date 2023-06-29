import { createDrawerNavigator, DrawerNavigationOptions } from '@react-navigation/drawer';

import { withLayoutContext } from 'expo-router';

const { Navigator } = createDrawerNavigator();

const ADrawer = withLayoutContext<DrawerNavigationOptions,
        typeof Navigator>(Navigator);

export default ADrawer;