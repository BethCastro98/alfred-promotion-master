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
import useFindPromotions from '@modules/user/application/promotions/use-find-promotions';
import useRemovePromotion from '@modules/user/application/promotions/use-remove-promotion';
import Promotion from '@modules/user/domain/models/promotion';
import RestaurantMall from '@modules/user/domain/models/restaurant-mall';
import SavePromotionModal from '@modules/user/ui/screens/PromotionsScreen/components/SavePromotionModal';
import RestaurantMallSelectInput from '@modules/user/ui/screens/PromotionsScreen/components/RestaurantMallSelectInput';
import useFindRestaurantMalls from '@modules/user/application/malls/use-find-restaurant-malls';
import BaseSwitchInput from '@main-components/Form/inputs/SwitchInput/components/BaseSwitchInput';
import useSavePromotion from '@modules/user/application/promotions/use-save-promotion';
import { isLoading } from 'expo-font';

export default function PromotionsScreen() {
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [selectedMall, setSelectedMall] = useState(null);
    const [selectedAvailability, setSelectedAvailability] = useState(null);

    const { data: promotions, loading, isRefetching, refetch } = useFindPromotions({
        availability: selectedAvailability,
        mallId: selectedMall
    });
    const { data: malls, loading: loadingMalls } = useFindRestaurantMalls();

    const { execute: removePromotion, loading: deleting } = useRemovePromotion();
    const confirm = useConfirm();
    const notify = useNotify();

    useFocusEffect(() => {
        refetch();
    });

    return (
        <AppLayout
        noPadding
        loading={isLoading}
        title={'Promociones'}
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
                            
                        </Form>
                    </Box>

                    <Box width={180}>
                        <Form toolbar={null}>
                            <RestaurantMallSelectInput
                                noMargin
                                source={'mall'}
                                placeholder={'Ubicación'}
                                onChange={(itemId) => {
                                    setSelectedMall(itemId);
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
                    malls={malls ?? []}
                    promotions={promotions ?? []}
                    onEditItem={(id) => {
                        setShowSaveModal(true);
                        setEditingItem(id);
                    }}
                    onDeleteItem={(id) => {
                        confirm({
                            title: 'Eliminar Promoción',
                            options: {
                                confirmText: 'Sí',
                                cancelText: 'No'
                            },
                            async onConfirm() {
                                await removePromotion(id);
                                notify('Eliminado con éxito', 'success');
                            },
                            content: '¿Estás seguro que deseas esta promoción?'
                        });
                    }}
                />


                <SavePromotionModal
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
    promotions,
    onEditItem,
    malls,
    onDeleteItem
}: { loading: boolean; malls: RestaurantMall[]; promotions: Promotion[], onEditItem: any, onDeleteItem: any }) {


    if (!loading && promotions.length == 0) {
        return (
            <NoItems
                title={'Aqui estarán las promociones listadas'}
                icon={<Icon
                    name={'ios-megaphone-outline'}
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
                    <TableCell>Imagen de la promoción</TableCell>
                        <TableCell>Titulo</TableCell>
                        <TableCell>Ubicación</TableCell>
                        <TableCell>Clic</TableCell>
                        <TableCell>Estatus</TableCell>
                        <TableCell></TableCell>
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
                            </TableRow>
                        ) : (
                            promotions?.map(c => {
                                return (
                                    <TableRow key={c.id}>
                                        <TableCell
                                            style={{
                                                width: 200
                                            }}
                                        >
                                            <Box
                                                width={150}
                                                height={150 / 2}
                                                borderRadius={8}
                                                borderWidth={1}
                                                borderColor={'greyMain'}
                                                overflow={'hidden'}
                                            >
                                                <Image
                                                    resizeMode={'cover'}
                                                    style={{
                                                        borderRadius: 8,
                                                        width: 150,
                                                        height: 150 / 2
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
                                        <MallsField
                                                ids={c.mallsIds}
                                                malls={malls}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Text>3</Text>
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

    const { execute: save, loading } = useSavePromotion();
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

function MallsField({ ids, malls }) {
    const category = malls?.filter(c => ids.includes(c.id));

    return (
        <TableCell>
            <Text>{malls?.map(e => e.name).join(', ')}</Text>
        </TableCell>
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