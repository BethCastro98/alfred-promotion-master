import AppDrawer from '@main-components/Base/AppDrawer';
import AppDrawerContent from '@main-components/Base/AppDrawer/components/AppDrawerContent';
import { useTheme } from '@shared/ui/theme/AppTheme';
import { Icon, TableIcon } from '@main-components/Base/Icon';

export const DRAWER_WIDTH = 320;
export const FOOTER_HEIGHT = 65;

export default function Layout() {
    const theme = useTheme();
    return (
            <AppDrawer
                    drawerContent={(props) => <AppDrawerContent {...props} />}
                    screenOptions={{
                        drawerStyle: {
                            maxWidth: DRAWER_WIDTH,
                            position: 'fixed',
                            left: 0,
                            backgroundColor: theme.colors.primaryMain
                        },
                        sceneContainerStyle: {
                            left: DRAWER_WIDTH,
                            width: `calc(100% - ${DRAWER_WIDTH}px)`
                        },
                        drawerType: 'permanent'
                    }}
            >
                
                   <AppDrawer.Screen
                        name={'promotions'}
                        options={{
                            drawerIcon: (props: any) => (
                                    <Icon
                                            name={'ios-megaphone-outline'}
                                            type={'ionicon'}
                                            color={props.color ?? 'white'}
                                            numberSize={20}
                                    />
                            ),
                            title: 'Promoción',
                            headerTitle: '',
                            headerShown: false
                        }}
                />

                <AppDrawer.Screen
                        name={'users'}
                        options={{
                            drawerIcon: (props: any) => (
                                    <Icon
                                            name={'user'}
                                            type={'feather'}
                                            color={props.color ?? 'white'}
                                            numberSize={20}
                                    />
                            ),
                            title: 'Usuarios',
                            headerTitle: '',
                            headerShown: false
                        }}
                />
     


            </AppDrawer>
                       

    );
}

