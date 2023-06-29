import { Box } from '@main-components/Base/Box';
import AppLayout from '@main-components/Layout/AppLayout';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@main-components/Base/Table';
import { TableContainer } from '@main-components/Base/Table/Table.web';
import Text from '@main-components/Typography/Text';
import TouchableOpacity from '@main-components/Utilities/TouchableOpacity';
import { Icon } from '@main-components/Base/Icon';
import { useState } from 'react';
import { useFocusEffect } from '@shared/domain/navigation/use-focus-effect';
import { Skeleton } from '@main-components/Base/Skeleton';
import NoItems from '@main-components/Secondary/NoItems';
import { IconButton } from '@main-components/Base/IconButton';
import useConfirm from '@shared/domain/hooks/use-confirm';
import useNotify from '@shared/domain/hooks/use-notify';
import { Image } from '@main-components/Base/Image';
import { Form } from '@main-components/Form/Form';
import SelectInput from '@main-components/Form/inputs/SelectInput';
import Product from '@modules/user/domain/models/product';
import SaveProductModal from '@modules/user/ui/screens/ProductsScreen/components/SaveProductModal';
import useFindProducts from '@modules/user/application/menu/use-find-products';
import useRemoveProduct from '@modules/user/application/menu/use-remove-product';
import BaseSwitchInput from '@main-components/Form/inputs/SwitchInput/components/BaseSwitchInput';
import useSaveProduct from '@modules/user/application/menu/use-save-product';

export default function ProductsScreen() {
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [selectedAvailability, setSelectedAvailability] = useState(null);

    const { data: items, loading, isRefetching, refetch } = useFindProducts({
        availability: selectedAvailability
    });
    const { execute: removeItem, loading: deleting } = useRemoveProduct();
    const confirm = useConfirm();
    const notify = useNotify();

    useFocusEffect(() => {
        refetch();
    });

    return (
            <AppLayout
                    title={'Menú'}
                    loading={loading || isRefetching || deleting}
            >
                <Box
                        flex={1}
                        bg={'white'}

                >
                    <Box
                            mb={'m'}
                            g={'m'}
                            justifyContent={'flex-end'}
                            flexDirection={'row'}
                            alignItems={'center'}
                    >
                        <Box width={180}>
                            <Form toolbar={null}>
                                <SelectInput
                                        noMargin
                                        source={'available'}
                                        placeholder={'Disponibles'}
                                        choices={[
                                            {
                                                id: 'ALL',
                                                name: 'Todas'
                                            },
                                            {
                                                id: 'AVAILABLE',
                                                name: 'Disponibles'
                                            },
                                            {
                                                id: 'NOT_AVAILABLE',
                                                name: 'No disponibles'
                                            }
                                        ]}
                                        onChange={(itemId) => {
                                            setSelectedAvailability(itemId);
                                        }}
                                />
                            </Form>
                        </Box>


                        <AddButton
                                onPress={() => {
                                    setShowSaveModal(true);
                                }}
                        />
                    </Box>

                    <ItemsList
                            loading={loading}
                            items={items ?? []}
                            onEditItem={(id) => {
                                setShowSaveModal(true);
                                setEditingItem(id);
                            }}
                            onDeleteItem={(id) => {
                                confirm({
                                    title: 'Eliminar producto',
                                    options: {
                                        confirmText: 'Sí',
                                        cancelText: 'No'
                                    },
                                    async onConfirm() {
                                        await removeItem(id);
                                        notify('Eliminado con éxito', 'success');
                                    },
                                    content: '¿Estás seguro que deseas este producto?'
                                });
                            }}
                    />

                    <SaveProductModal
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

function ItemsList({
    loading,
    items,
    onEditItem,
    onDeleteItem
}: { loading: boolean; items: Product[], onEditItem: any, onDeleteItem: any }) {


    if (!loading && items.length == 0) {
        return (
                <NoItems
                        title={'Aqui estarán los productos listados'}
                        icon={<Icon
                                name={'fast-food'}
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
                                Imagen
                            </TableCell>
                            <TableCell>
                                Nombre
                            </TableCell>
                            <TableCell>
                                Categoría
                            </TableCell>
                            <TableCell>
                                Precio
                            </TableCell>
                            <TableCell>
                                Estatus
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
                                    </TableRow>
                            ) : (
                                    items?.map(c => {
                                        return (
                                                <TableRow key={c.id}>
                                                    <TableCell
                                                            style={{
                                                                width: 200
                                                            }}
                                                    >
                                                        <Box
                                                                width={100}
                                                                height={100}
                                                                borderRadius={8}
                                                                borderWidth={1}
                                                                borderColor={'greyMain'}
                                                                overflow={'hidden'}
                                                        >
                                                            <Image
                                                                    resizeMode={'cover'}
                                                                    style={{
                                                                        borderRadius: 8,
                                                                        width: 100,
                                                                        height: 100
                                                                    }}
                                                                    source={{
                                                                        uri: c.imageUrl
                                                                    }}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Text>{c.name}</Text>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Text>{c.categoryName}</Text>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Text>{c.price.formattedValue} {c.unity}</Text>
                                                    </TableCell>
                                                    <TableCell>
                                                        <StatusUpdate
                                                                source={'isActive'}
                                                                item={c}
                                                        />
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

function StatusUpdate({ source, item }) {
    const value = item[source];

    const [isActive, setIsActive] = useState(value);

    const { execute: save, loading } = useSaveProduct();
    return (
            <BaseSwitchInput
                    value={isActive}
                    selectedColor={'successMain'}
                    onChange={async (val) => {
                        if (!item) return;
                        setIsActive(val);
                        item.updateInfo({
                            available: val
                        });

                        await save(item, {
                            imageUrl: item.imageUrl
                        });
                    }}
            />
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