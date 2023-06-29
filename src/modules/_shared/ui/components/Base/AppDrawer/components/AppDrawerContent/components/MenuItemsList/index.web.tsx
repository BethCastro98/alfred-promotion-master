import { useTheme } from '@modules/_shared/ui/theme/AppTheme';
import React, { useEffect, useMemo, useState } from 'react';
import Collapse from '../Collapse/index.web';
import DrawerItem from '../DrawerItem';
import useNavigation from '@shared/domain/hooks/navigation/use-navigation';
import { useSegments } from 'expo-router';


export default function MenuItemsList(props) {

    const { collapsed } = props;
    const theme = useTheme();

    const activeStyle = {
        bold: true,
        color: 'white'
    };

    const segments = useSegments();

    const segmentUrl = useMemo(() => {
        const validSegments = segments?.filter(s => s.indexOf('(') === -1);
        if (validSegments.length == 0) return '';
        return validSegments.join('/');
    }, [segments]);

    const [openSubmenu, setOpenSubmenu] = useState(undefined);

    const sanitizedElements = getSanitazedDescriptors(props.descriptors);

    const selectedRoute = Object.keys(sanitizedElements).find(el => {
        const item = sanitizedElements[el];

        const regex = /index|\/index/g;

        if (segmentUrl.indexOf(el) > -1) return true;

        if (item.hasItems) {
            return Object.values(item?.items)?.some(a => a.route?.name?.replace(regex, '') == segmentUrl);
        }

        return item?.route?.name?.replace(regex, '') == segmentUrl;
    });


    useEffect(() => {
        const el = sanitizedElements[selectedRoute];
        if (el?.hasItems) {
            setOpenSubmenu(el?.key);
        }
    }, [selectedRoute, segmentUrl]);

    const { navigate } = useNavigation();

    return (
            <>
                {Object.keys(sanitizedElements).map(el => {
                    const item = sanitizedElements[el];
                    const icon = item?.options?.drawerIcon;
                    const isSelected = el === selectedRoute;

                    if (item.hasItems) {
                        const label = item?.name;
                        const subItems = Object.values(item.items);

                        const selectedSubItem = subItems?.find((subItem: any) => {
                            const name = subItem?.route?.name?.replace('/index', '');
                            return segmentUrl == name;
                        });

                        return (
                                <CollapsibleDrawerItem
                                        collapsed={collapsed}
                                        isSubmenu
                                        icon={icon}
                                        key={el}
                                        label={label as any}
                                        activeStyle={activeStyle}
                                        style={
                                            isSelected ? activeStyle : undefined
                                        }
                                        open={openSubmenu == el}
                                        onPress={() => {
                                            setOpenSubmenu(el);
                                        }}
                                        onItemPress={(route) => {
                                            navigate(route);
                                        }}
                                        collapsedItem={undefined}
                                        subItems={subItems}
                                        selectedItem={selectedSubItem}
                                        route={''}
                                        {...props}
                                        menuCollapsed={props.collapsed}
                                />
                        );
                    }

                    const label = item?.options?.title;

                    return (
                            <DrawerItem
                                    key={el}
                                    collapsed={collapsed}
                                    icon={icon}
                                    style={
                                        isSelected ? activeStyle : undefined
                                    }
                                    label={label as any}
                                    onPress={() => {
                                        navigate(item?.route?.name?.replace('index', ''));
                                    }}
                            />
                    );
                })}
            </>
    );

}

function getSanitazedDescriptors(descriptors) {
    return Object.keys(descriptors).filter(e => {
        return descriptors[e]?.options?.title !== '*';
    }).reduce((obj, el) => {
        const isSubmenu = el.indexOf('/') > -1;

        if (!isSubmenu) {
            return {
                ...obj,
                [el]: {
                    key: el,
                    hasItems: false,
                    ...descriptors[el]
                }
            };
        }

        const key = el.split('/').shift() ?? '';

        const prev = obj[key] ?? {};
        const descriptor = descriptors[el];
        const isIndex = descriptor?.route.name?.indexOf('index') > -1;

        return {
            ...obj,
            [key]: {
                ...prev,
                hasItems: true,
                key: key,
                name: isIndex ? descriptor?.options?.title?.split('-')?.shift()?.trim() : prev?.name ?? '',
                items: {
                    ...prev?.items ?? {},
                    [el]: {
                        key: el,
                        ...descriptors[el]
                    }
                }
            }
        };
    }, {});
}


function CollapsibleDrawerItem({
    collapsed,
    icon,
    selectedItem,
    collapsedItem,
    route,
    label,
    style,
    activeStyle,
    subItems,
    onPress,
    onItemPress,
    open,
    menuCollapsed,
    ...props
}) {

    return (
            <>
                <DrawerItem
                        collapsed={collapsed}
                        isSubmenu
                        icon={icon}
                        label={label as any}
                        style={style}
                        open={open}
                        onPress={onPress}
                        {...props}
                />
                <Collapse
                        collapsed={!open}
                >
                    {subItems.map((subItem, idx) => {

                        const label = subItem.options.title?.split('-')?.pop();

                        return (
                                <DrawerItem
                                        key={idx}
                                        style={
                                            selectedItem?.key == subItem.key
                                                    ? activeStyle
                                                    : undefined
                                        }
                                        label={label as any}
                                        {...props}
                                        labelStyle={{ paddingLeft: 26 }}
                                        onPress={() => onItemPress(subItem?.route?.name?.replace('/index', ''))}
                                        isSubmenu={false}
                                />
                        );
                    })}
                </Collapse>
            </>
    );
}