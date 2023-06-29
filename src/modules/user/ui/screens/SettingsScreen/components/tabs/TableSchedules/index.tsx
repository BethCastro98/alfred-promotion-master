import { Box } from '@main-components/Base/Box';
import useFindTableSchedules from '@modules/tables/application/schedules/use-find-table-schedules';
import { useDeleteTableSchedule } from '@modules/tables/application/schedules/use-delete-table-schedule';
import { Icon } from '@main-components/Base/Icon';
import TouchableOpacity from '@main-components/Utilities/TouchableOpacity';
import { IconButton } from '@main-components/Base/IconButton';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@main-components/Base/Table';
import { TableContainer } from '@main-components/Base/Table/Table.web';
import TableSchedule from '@modules/tables/domain/models/table-schedule';
import NoItems from '@main-components/Secondary/NoItems';
import { useFocusEffect } from '@shared/domain/navigation/use-focus-effect';
import useConfirm from '@shared/domain/hooks/use-confirm';
import useNotify from '@shared/domain/hooks/use-notify';
import { useState } from 'react';
import { TableLoadingSkeleton } from '@main-components/Layout/TableLoadingSkeleton';
import Text from '@main-components/Typography/Text';
import SaveTableScheduleModal
    from '@modules/user/ui/screens/SettingsScreen/components/tabs/TableSchedules/components/SaveTableScheduleModal';

export default function TableSchedules() {

    const [showSaveModal, setShowSaveModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const { data, ids, loading, isRefetching, refetch } = useFindTableSchedules();
    const { delete: removeItem, loading: deleting } = useDeleteTableSchedule();
    const confirm = useConfirm();
    const notify = useNotify();

    useFocusEffect(() => {
        refetch();
    });

    const items = ids?.map((id) => data?.[id]);
    return (
        <Box flexDirection={'row'}>
            <Box
                maxWidth={700}
                width={'100%'}
            >
                <Box
                    mb={'m'}
                    alignItems={'flex-end'}
                >
                    <AddButton
                        onPress={() => {
                            setShowSaveModal(true);
                        }}
                    />
                </Box>

                <ItemList
                    loading={loading}
                    items={items ?? []}
                    onEditItem={(id) => {
                        setShowSaveModal(true);
                        setEditingItem(id);
                    }}
                    onDeleteItem={(id) => {
                        confirm({
                            title: 'Eliminar horario',
                            options: {
                                confirmText: 'Sí',
                                cancelText: 'No'
                            },
                            async onConfirm() {
                                await removeItem(id);
                                notify('Eliminado con éxito', 'success');
                            },
                            content: '¿Estás seguro que deseas este horario?'
                        });
                    }}
                />

                <SaveTableScheduleModal
                    modal={{
                        visible: showSaveModal,
                        onDismiss() {
                            setEditingItem(null);
                            setShowSaveModal(false);
                        }
                    }}
                    form={{
                        id: editingItem
                    }}
                />
            </Box>
        </Box>
    );
}


function ItemList({
    loading,
    items,
    onEditItem,
    onDeleteItem
}: { loading: boolean; items: TableSchedule[], onEditItem: any, onDeleteItem: any }) {


    if (!loading && items.length == 0) {
        return (
            <NoItems
                title={'Aqui estarán los horarios creados'}
                icon={<Icon
                    name={'category'}
                    type={'material'}
                    color={'greyMain'}
                    numberSize={100}
                />}
            />
        );
    }
    if (loading) {
        return (
            <TableLoadingSkeleton
                rowsCount={5}
                cellsCount={3}
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
                            Nombre
                        </TableCell>
                        <TableCell style={{ width: 100 }}>
                            Opciones
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        items?.map(c => {
                            return (
                                <TableRow key={c.id}>
                                    <TableCell>
                                        <Text>{c.name}</Text>
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
                                        />

                                    </TableCell>
                                </TableRow>
                            );
                        })
                    }
                </TableBody>
            </Table>
        </Box>

    );
}

function RowOptions({ entity, onEdit, onDelete }: { entity: any, onEdit: any; onDelete: any }) {
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
        </Box>
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