import { useAppLayout } from '@shared/ui/hooks/use-app-layout';
import { useEffect } from 'react';
import { useFocusEffect } from '@shared/domain/navigation/use-focus-effect';

export function useHideMenu() {
    const toggleCollapseMenu = useAppLayout((values) => values.toggleCollapseMenu);

    useEffect(() => {
        toggleCollapseMenu(true);
    }, []);

    useFocusEffect(() => {
        toggleCollapseMenu(true);

    }, []);
}