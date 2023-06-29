import {useEffect, useState} from "react";

export function useDrawerController(labels, focusedRoute) {
    const [collapsedItem, setCollapsedItem] = useState<any>(null);
    const [activeRoute, setActiveRoute] = useState<any>(null);


    function findSubItems(key) {
        const firstPart = key.split('__')[0];
        return labels.filter((d) => {
            const label = d;

            if (label == '*') return false;

            if (d.startsWith(firstPart) && d.indexOf('__') > -1) {
                if (d.indexOf('__Root') == -1) {
                    //if (d.indexOf('__OrderDetails') !== -1) return false;
                    return true;
                }
                return false;
            }

        });
    }

    useEffect(() => {
        const route = focusedRoute.split('-')[0];

        setActiveRoute(route);

        setCollapsedItem(findCollapsedItem(route));
    }, [focusedRoute]);

    function findCollapsedItem(key) {
        const route = key.split('-')[0];

        if (key.indexOf('__') == -1) {
            return route;
        }

        const subItems = findSubItems(route);

        const selectedItem = subItems.find((item) => {
            return item.split('-')[0] == route;
        });

        if (!selectedItem) return;

        const finalRoot = selectedItem.split('-')[0].split('__')[0] + '__Root';

        return finalRoot;
    }

    return {collapsedItem, setCollapsedItem, setActiveRoute, activeRoute, findSubItems};
}