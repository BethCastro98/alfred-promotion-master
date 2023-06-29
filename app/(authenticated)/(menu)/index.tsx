import DashboardScreen from '@modules/user/ui/screens/DashboardScreen';
import useGetIdentity from '@modules/auth/application/use-get-identity';
import { Box } from '@main-components/Base/Box';
import InDevelopment from '@main-components/Base/InDevelopment';

export default function DashboardRoute() {
    const { identity } = useGetIdentity();


    if (!identity) return <Box></Box>;


    if (identity.isAdmin) {
        return <DashboardScreen />;
    }

    return (
            <InDevelopment />
    );
}