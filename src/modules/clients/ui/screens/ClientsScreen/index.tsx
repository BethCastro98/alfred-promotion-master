import AppLayout from '@main-components/Layout/AppLayout';
import NoItems from '@main-components/Secondary/NoItems';
import { Icon } from '@main-components/Base/Icon';
import { Box } from '@main-components/Base/Box';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@main-components/Base/Table';
import { TableContainer } from '@main-components/Base/Table/Table.web';
import { Skeleton } from '@main-components/Base/Skeleton';
import Text from '@main-components/Typography/Text';
import { IconButton } from '@main-components/Base/IconButton';
import Client from '@modules/clients/domain/models/client';
import TouchableOpacity from '@main-components/Utilities/TouchableOpacity';
import { useState } from 'react';
import SaveClientModal from '@modules/clients/ui/screens/ClientsScreen/components/SaveClientModal';
import useFindClients from '@modules/clients/application/use-find-clients';
import { Image } from '@main-components/Base/Image';
import useConfirm from '@shared/domain/hooks/use-confirm';
import { useDeleteClient } from '@modules/clients/application/use-delete-client';

export default function ClientsScreen() {
    const { data, ids, loading: loadingClients } = useFindClients({}, undefined, undefined, undefined);
    const items = ids?.map(el => data?.[el]) ?? [];
    const { delete: removeClient, loading: deleting } = useDeleteClient();


    const [showSaveModal, setShowSaveModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const isLoading = loadingClients || deleting;
    const confirm = useConfirm();

    return (
            <AppLayout
                    loading={isLoading}
                    title={'Clientes'}
            >
                <Box
                        mb={'m'}
                        g={'m'}
                        justifyContent={'flex-end'}
                        flexDirection={'row'}
                        alignItems={'center'}
                >
                    <AddButton
                            onPress={() => {
                                setShowSaveModal(true);
                            }}
                    />
                </Box>


                <ItemsList
                        loading={isLoading}
                        items={items}
                        onEditItem={(id) => {
                            setShowSaveModal(true);
                            setEditingItem(id);
                        }}
                        onDeleteItem={(id) => {
                            confirm({
                                title: 'Eliminar Cliente',
                                options: {
                                    confirmText: 'Sí',
                                    cancelText: 'No'
                                },
                                async onConfirm() {
                                    await removeClient(id);
                                },
                                content:
                                        '¿Estás seguro que deseas este cliente?'
                            });
                        }}

                />

                <SaveClientModal
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

            </AppLayout>
    );
}


function ItemsList({
    loading,
    items,
    onEditItem,
    onDeleteItem
}: { loading: boolean; items: Client[], onEditItem: any, onDeleteItem: any }) {


    if (!loading && items.length == 0) {
        return (
                <NoItems
                        title={'Aqui estarán los clientes listados'}
                        icon={<Icon
                                name={'user'}
                                type={'feather'}
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
                                Foto
                            </TableCell>
                            <TableCell>
                                Nombre
                            </TableCell>
                            <TableCell>
                                Email
                            </TableCell>
                            <TableCell>
                                Teléfono
                            </TableCell>
                            <TableCell>
                                Alergias
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
                                        <TableCell
                                                style={{
                                                    width: 80
                                                }}
                                        >
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
                                                <TableRow key={c.id}>
                                                    <TableCell
                                                            style={{
                                                                width: 80
                                                            }}
                                                    >
                                                        <Box
                                                                width={80}
                                                                height={80}
                                                                borderRadius={40}
                                                                borderWidth={1}
                                                                borderColor={'primaryMain'}
                                                                overflow={'hidden'}
                                                        >
                                                            <Image
                                                                    resizeMode={'cover'}
                                                                    style={{
                                                                        borderRadius: 40,
                                                                        width: 80,
                                                                        height: 80
                                                                    }}
                                                                    source={{
                                                                        uri: c.imageUrl
                                                                    }}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Text>{c.fullName}</Text>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Text>{c.email}</Text>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Text>{c.phone}</Text>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Text>{c.allergies}</Text>
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
                            )
                        }
                    </TableBody>
                </Table>
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