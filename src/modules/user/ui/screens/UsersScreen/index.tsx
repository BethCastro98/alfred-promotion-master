import AppLayout from '@main-components/Layout/AppLayout';
import { Box } from '@main-components/Base/Box';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@main-components/Base/Table';
import Text from '@main-components/Typography/Text';
import TouchableOpacity from '@main-components/Utilities/TouchableOpacity';
import { Icon } from '@main-components/Base/Icon';
import { useState } from 'react';
import NoItems from '@main-components/Secondary/NoItems';
import useConfirm from '@shared/domain/hooks/use-confirm';
import useNotify from '@shared/domain/hooks/use-notify';
import { useFocusEffect } from '@shared/domain/navigation/use-focus-effect';
import { IconButton } from '@main-components/Base/IconButton';
import { Skeleton } from '@main-components/Base/Skeleton';
import SaveUserModal from '@modules/user/ui/screens/UsersScreen/components/SaveUserModal';
import useRemoveUser from '@modules/user/application/accounts/use-remove-user';
import useFindUsers from '@modules/user/application/accounts/use-find-users';
import AccountUser from '@modules/user/domain/models/account-user';
import { TableContainer } from '@main-components/Base/Table/Table.web';
import useGetIdentity from '@modules/auth/application/use-get-identity';


export default function UsersScreen() {
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const { data: users, loading, isRefetching, refetch } = useFindUsers();
    const { execute: removeUser, loading: deleting } = useRemoveUser();
    const confirm = useConfirm();
    const notify = useNotify();

    useFocusEffect(() => {
        refetch();
    }, []);


    return (
        <AppLayout
            title={'Usuarios'}
            loading={loading || isRefetching || deleting}
        >
            <Box
                flex={1}
                bg={'white'}
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
                <UsersList
                    loading={loading}
                    users={users ?? []}
                    onEditItem={(id) => {
                        setShowSaveModal(true);
                        setEditingItem(id);
                    }}
                    onDeleteItem={(id) => {
                        confirm({
                            title: 'Eliminar usuario',
                            options: {
                                confirmText: 'Sí',
                                cancelText: 'No'
                            },
                            async onConfirm() {
                                await removeUser(id);
                                notify('Eliminado con éxito', 'success');
                            },
                            content: '¿Estás seguro que deseas este usuario?'
                        });
                    }}
                />
                <SaveUserModal
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
        </AppLayout>
    );
}

function UsersList({
    loading,
    users,
    onEditItem,
    onDeleteItem
}: { loading: boolean; users: AccountUser[], onEditItem: any, onDeleteItem: any }) {
    if (!loading && users.length == 0) {
        return (
            <NoItems
                title={'Aqui estarán los usuarios listados'}
                icon={<Icon
                    name={'user'}
                    type={'entypo'}
                    color={'greyMain'}
                    numberSize={100}
                />}
            />
        );
    }

    return (
        <Table BaseComponent={TableContainer}>
            <TableHead>
                <TableRow>
                    <TableCell>
                        Nombre
                    </TableCell>
                    <TableCell>
                        Email
                    </TableCell>
                    <TableCell>
                        Rol
                    </TableCell>
                    <TableCell>
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
                        </TableRow>
                    ) : (
                        users?.map(r => {
                            return (
                                <TableRow key={r.id}>

                                    <TableCell>
                                        <Text>{r.fullName}</Text>
                                    </TableCell>

                                    <TableCell>
                                        <Text>{r.email}</Text>
                                    </TableCell>

                                    <TableCell>
                                        <Text>{r.roleName}</Text>
                                    </TableCell>

                                    <TableCell style={{ width: 100 }}>
                                        <RowOptions
                                            entity={r}
                                            onEdit={() => {
                                                onEditItem(r.id);
                                            }}
                                            onDelete={() => {
                                                onDeleteItem(r.id);
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
    );
}


function RowOptions({ entity, onEdit, onDelete }: { entity: any, onEdit: any; onDelete: any }) {
    const { identity } = useGetIdentity();

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
            {
                identity?.id !== entity.id && (
                    <IconButton
                        onPress={() => {
                            onDelete();
                        }}
                        iconType={'feather'}
                        iconColor={'greyDark'}
                        iconName={'trash'}
                    />
                )
            }

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