import AppLayout from '@main-components/Layout/AppLayout';
import useFindReservations from '@modules/reservations/application/use-find-reservations';
import NoItems from '@main-components/Secondary/NoItems';
import { Icon } from '@main-components/Base/Icon';
import { Box } from '@main-components/Base/Box';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@main-components/Base/Table';
import { TableContainer } from '@main-components/Base/Table/Table.web';
import { Skeleton } from '@main-components/Base/Skeleton';
import Text from '@main-components/Typography/Text';
import { IconButton } from '@main-components/Base/IconButton';
import Reservation from '@modules/reservations/domain/models/reservation';
import DateTimeUtils from '@utils/misc/datetime-utils';
import DatetimeUtils from '@utils/misc/datetime-utils';
import ArrayUtils from '@utils/misc/array-utils';
import TextUtils from '@utils/misc/text-utils';
import ScrollView from '@main-components/Utilities/ScrollView';
import React, { useState } from 'react';
import { Agenda } from '@main-components/Base/Agenda';
import SaveReservationModal from '@modules/reservations/ui/screens/ReservationsScreen/components/SaveReservationModal';
import useConfirm from '@shared/domain/hooks/use-confirm';
import { useDeleteReservation } from '@modules/reservations/application/use-delete-reservation';
import TouchableOpacity from '@main-components/Utilities/TouchableOpacity';
import useUpdateReservation from '@modules/reservations/application/use-update-reservation';

export default function ReservationsScreen() {
    const { loading: loadingReservations } = useFindReservations({}, undefined, undefined, undefined);
    const { loading: loadingReservationsCalendar } = useFindReservations({}, undefined, undefined, {
        queryGroups: ['calendar']
    });
    const { save: updateReservation, loading: updating } = useUpdateReservation();

    const { delete: removeReservation, loading: deleting } = useDeleteReservation();


    const [showSaveModal, setShowSaveModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [selectedLayout, setSelectedLayout] = useState('list');
    const [defaultValues, setDefaultValues] = useState(null);

    const confirm = useConfirm();


    const actionProps = {
        onEditItem: (id) => {
            setShowSaveModal(true);
            setEditingItem(id);
        },
        onDeleteItem: (id) => {
            confirm({
                title: 'Eliminar reservación',
                options: {
                    confirmText: 'Sí',
                    cancelText: 'No'
                },
                async onConfirm() {
                    await removeReservation(id);
                },
                content:
                        '¿Estás seguro que deseas esta reservación?'
            });
        }
    };
    return (
            <AppLayout
                    noPadding
                    loading={loadingReservations || loadingReservationsCalendar || deleting || updating}
                    title={'Reservaciones disponibles'}
            >

                <Box
                        p={'m'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        flexDirection={'row'}
                >
                    <Box
                            alignItems={'center'}
                            flexDirection={'row'}
                    >
                        <Box mr={'m'}>
                            <IconButton
                                    iconName={'list'}
                                    containerSize={50}
                                    backgroundColor={selectedLayout == 'list' ? 'appSuccess' : 'greyMedium'}
                                    borderRadius={50 / 2}
                                    onPress={() => {
                                        setSelectedLayout('list');
                                    }}
                            />
                        </Box>
                        <Box mr={'m'}>
                            <IconButton
                                    iconName={'calendar'}
                                    iconType={'font-awesome'}
                                    containerSize={50}
                                    backgroundColor={selectedLayout == 'calendar' ? 'appSuccess' : 'greyMedium'}
                                    borderRadius={50 / 2}
                                    onPress={() => {
                                        setSelectedLayout('calendar');
                                    }}
                            />
                        </Box>
                    </Box>

                    <Box>

                        <AddButton
                                onPress={() => {
                                    setShowSaveModal(true);
                                }}
                        />
                    </Box>
                </Box>

                <ScrollView>
                    {
                        selectedLayout == 'list' ? (
                                <>
                                    <ListView
                                            {...actionProps}
                                            updateReservation={updateReservation}
                                    />
                                </>
                        ) : (
                                <CalendarView
                                        {...actionProps}
                                        onAdd={({ date }) => {
                                            setDefaultValues({ date: date });
                                            setShowSaveModal(true);
                                        }}
                                />
                        )
                    }
                </ScrollView>

                <SaveReservationModal
                        modal={{
                            visible: showSaveModal,
                            onDismiss() {
                                setDefaultValues(null);
                                setEditingItem(null);
                                setShowSaveModal(false);
                            }
                        }}
                        form={{
                            defaultValues: defaultValues,
                            id: editingItem
                        }}
                />

            </AppLayout>
    );
}

function AddButton({ onPress }) {
    return (
            <TouchableOpacity onPress={onPress}>
                <Box
                        bg={'greyDark'}
                        borderRadius={16}
                        p={'m'}
                        justifyContent={'center'}
                        alignItems={'center'}
                >
                    <Icon
                            name={'plus-circle-outline'}
                            type={'material-community-icons'}
                            numberSize={24}
                    />
                </Box>
            </TouchableOpacity>
    );
}

function ListView(props) {
    const { data, ids, loading: loadingReservations } = useFindReservations({}, undefined, undefined, undefined);
    const items = ids?.map(el => data?.[el]) ?? [];

    const groupedItems = ArrayUtils.groupBy(items ?? [], 'date');

    if (!loadingReservations && items.length == 0) {
        return (
                <NoItems
                        title={'Aqui estarán las resevaciones listadas'}
                        icon={<Icon
                                name={'calendar'}
                                type={'ionicon'}
                                color={'greyMain'}
                                numberSize={100}
                        />}
                />
        );
    }

    return (
            <>
                {
                    Object.keys(groupedItems).map(key => {
                        const group = groupedItems[key];

                        const title = (() => {
                            const part1 = DateTimeUtils.format2(DateTimeUtils.fromString(key, 'YYYY-MM-DD'), 'iii dd');
                            const part2 = DateTimeUtils.format2(DateTimeUtils.fromString(key, 'YYYY-MM-DD'), 'MMMM');

                            return `${TextUtils.capitalize(part1)} de ${TextUtils.capitalize(part2)}`;
                        })();

                        return (
                                <Box p={'m'}>
                                    <Box
                                            paddingVertical={'s'}
                                            marginVertical={'m'}
                                            borderTopWidth={2}
                                            borderTopColor={'primaryMain'}
                                            style={{
                                                width: 'fit-content'
                                            }}
                                    >
                                        <Text
                                                variant={'heading1'}
                                                bold
                                        >{title}</Text>
                                    </Box>
                                    <Box>
                                        <ItemsList
                                                loading={loadingReservations}
                                                items={group}
                                                onEditItem={props.onEditItem}
                                                onDeleteItem={props.onDeleteItem}
                                                onCheckItem={(item: Reservation) => {
                                                    item.checkIn();
                                                    props.updateReservation(item.id, item);
                                                }}
                                        />
                                    </Box>
                                </Box>
                        );
                    })
                }
            </>
    );
}

function CalendarView(props) {

    const [range, setRange] = useState();

    const { data, ids, loading: loadingReservationsCalendar } = useFindReservations({
        range: range
    }, undefined, undefined, {
        queryGroups: ['calendar']
    });

    const viewItems = ids?.map(el => {
        const element = data[el];

        return {
            id: element.id,
            title: `${element.clientName}`,
            date: DatetimeUtils.fromString(`${element.date} ${element.hour}`, 'YYYY-MM-DD HH:mm')
        };
    }) ?? [];
    const calendarRef = React.createRef();

    /*   useEffect(() => {
           if (!calendarRef.current) return;
           console.log();
           calendarRef.current._calendarApi.refetchEvents
       }, [calendarRef]);*/

    return (
            <Box p={'m'}>
                <Agenda
                        calendarRef={calendarRef}
                        events={viewItems}
                        onMonthChange={(range) => {
                            setRange(range);
                        }}
                        onAddEvent={props.onAdd}
                        onEventPress={(id) => {
                            props.onEditItem(id);
                        }}
                />
            </Box>
    );
}

function ItemsList({
    loading,
    items,
    onEditItem,
    onDeleteItem,
    onCheckItem
}: { loading: boolean; items: Reservation[], onCheckItem: any; onEditItem: any, onDeleteItem: any }) {

    const confirm = useConfirm();

    if (!loading && items.length == 0) {
        return (
                <NoItems
                        title={'Sin resevaciones'}
                        icon={<Icon
                                name={'calendar'}
                                type={'ionicon'}
                                color={'greyMain'}
                                numberSize={100}
                        />}
                />
        );
    }

    return (
            <Box
                    flex={1}
                    p={'s'}
                    style={{
                        overflow: 'auto'
                    }}
            >
                <Table BaseComponent={TableContainer}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Hora
                            </TableCell>

                            <TableCell>
                                Cliente
                            </TableCell>

                            <TableCell>
                                # de personas
                            </TableCell>
                            <TableCell>
                                Ubicación
                            </TableCell>
                            <TableCell>
                                Mesa
                            </TableCell>
                            <TableCell>
                                Alergias
                            </TableCell>
                            <TableCell>
                                Estado
                            </TableCell>
                            <TableCell style={{ width: 100 }}>
                                Opciones
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            loading ? (
                                    <TableRow>
                                        <TableCell>
                                            <Skeleton
                                                    loading
                                                    type={'rectangle'}
                                                    height={30}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton
                                                    loading
                                                    type={'rectangle'}
                                                    height={30}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton
                                                    loading
                                                    type={'rectangle'}
                                                    height={30}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton
                                                    loading
                                                    type={'rectangle'}
                                                    height={30}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton
                                                    loading
                                                    type={'rectangle'}
                                                    height={30}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton
                                                    loading
                                                    type={'rectangle'}
                                                    height={30}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton
                                                    loading
                                                    type={'rectangle'}
                                                    height={30}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton
                                                    loading
                                                    type={'rectangle'}
                                                    height={30}
                                            />
                                        </TableCell>
                                    </TableRow>
                            ) : (
                                    items?.map(c => {
                                        return (
                                                <TableRow
                                                        key={c.id}
                                                >

                                                    <TableCell>
                                                        <Text>{c.hour}</Text>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Text>{c.clientName}</Text>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Text>{c.numberOfPeople}</Text>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Text>{c.mallName}</Text>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Text>{c.tableNumber}</Text>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Text>{c.clientAllergies}</Text>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Text
                                                                bold
                                                                color={c.isCheckedIn ? 'appSuccess' : 'warningMain'}
                                                        >{c.isCheckedIn ? 'Asistido' : 'En espera'}</Text>
                                                    </TableCell>
                                                    <TableCell>
                                                        <RowOptions
                                                                entity={c}
                                                                onEdit={() => {
                                                                    onEditItem(c.id);
                                                                }}
                                                                onDelete={() => {
                                                                    onDeleteItem(c.id);
                                                                }}
                                                                onCheck={() => {
                                                                    confirm({
                                                                        title: 'Confirmar asistencia',
                                                                        content: 'Confirmar asistencia de la reservación',
                                                                        options: {
                                                                            cancelText: 'Cerrar',
                                                                            confirmText: 'Sí, confirmar'
                                                                        },
                                                                        onConfirm() {
                                                                            onCheckItem(c);
                                                                        }
                                                                    });
                                                                }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                        );
                                    })
                            )
                        }
                    </TableBody>
                </Table>
            </Box>

    );
}


function RowOptions({ entity, onEdit, onDelete, onCheck }: { onCheck: any; entity: any, onEdit: any; onDelete: any }) {
    return (
            <Box
                    gap={'s'}
                    flexDirection={'row'}
            >
                <IconButton
                        onPress={() => {
                            onEdit();
                        }}
                        iconType={'feather'}
                        iconColor={'greyDark'}
                        iconName={'edit'}
                />
                <IconButton
                        onPress={() => {
                            onDelete();
                        }}
                        iconType={'feather'}
                        iconColor={'greyDark'}
                        iconName={'trash'}
                />

                {
                        !entity!.isCheckedIn && (
                                <IconButton
                                        onPress={() => {
                                            onCheck();
                                        }}
                                        iconType={'feather'}
                                        iconColor={'greyDark'}
                                        iconName={'check'}
                                />
                        )
                }

            </Box>
    );
}