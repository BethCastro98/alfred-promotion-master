import { Form } from '@main-components/Form/Form';
import TextInput from '@main-components/Form/inputs/TextInput';
import { Box } from '@main-components/Base/Box';
import { required } from '@shared/domain/form/validate';
import SaveButton from '@main-components/Form/components/SaveButton';
import AppIcon from '@main-components/Base/AppIcon';
import React from 'react';
import UuidUtils from '@utils/misc/uuid-utils';
import useNotify from '@shared/domain/hooks/use-notify';
import CheckboxInput from '@main-components/Form/inputs/CheckboxInput';
import {
    ProductImageInput
} from '@modules/user/ui/screens/ProductsScreen/components/SaveProductModal/components/ProductForm/components/ProductImageInput';
import Product from '@modules/user/domain/models/product';
import useGetIdentity from '@modules/auth/application/use-get-identity';
import useSaveProduct from '@modules/user/application/menu/use-save-product';
import MoneyInput from '@main-components/Form/inputs/MoneyInput';
import SelectInput from '@main-components/Form/inputs/SelectInput';
import useFindProductCategories from '@modules/user/application/menu/use-find-product-categories';

interface ProductFormProps {
    id?: string;
    defaultValues?: any;
    onSave: any;
    item?: Product;
}


export default function ProductForm(props: ProductFormProps) {
    return (
        <Form
            defaultValues={props.defaultValues}
            toolbar={
                <FormToolbar
                    item={props.item}
                    id={props.id}
                    onSave={props.onSave}
                />
            }
        >

            <Box
                flexDirection={'row'}
            >
                <Box
                    flex={0.5}
                    mr={'l'}
                >
                    <TextInput
                        required
                        validate={required()}
                        label={'Nombre'}
                        source={'name'}
                    />


                    <ProductCategoryInput />

                    <MoneyInput
                        required
                        validate={required()}
                        label={'Precio'}
                        source={'price'}
                    />

                    <SelectInput
                        required
                        validate={required()}
                        label={'Unidad de venta'}
                        source={'unity'}
                        choices={[
                            {
                                id: 'c/u',
                                name: 'c/u'
                            },
                            {
                                id: 'L',
                                name: 'L'
                            },
                            {
                                id: 'g',
                                name: 'g'
                            },
                            {
                                id: 'Kg',
                                name: 'Kg'
                            }
                        ]}
                    />

                    <CheckboxInput
                        source={'available'}
                        title={'Disponible'}
                        required
                        label={'Disponible'}
                    />
                </Box>
                <Box flex={0.5}>
                    <ProductImageInput
                        label={'Imagen'}
                        helperText={'Aspecto 1:1. Min: 400px x 400px'}
                    />
                </Box>
            </Box>

        </Form>
    );
}

function ProductCategoryInput() {
    const { data, loading } = useFindProductCategories();
    return (
        <SelectInput
            required
            validate={required()}
            label={'Categoría'}
            source={'category'}
            choices={data ?? []}
        />
    );
}

function FormToolbar(props) {
    const { execute: save, loading } = useSaveProduct();
    const notify = useNotify();

    const { identity } = useGetIdentity();
    const { data: products } = useFindProductCategories();
    return (
        <Box alignItems={'center'}>
            <SaveButton
                {...props}
                label='Guardar'
                titleColor={'white'}
                loading={loading}
                backgroundColor={'primaryMain'}
                uppercase={false}
                icon={() => {
                    return <AppIcon
                        name='save'
                        size={20}
                        color='white'
                    />;
                }}
                onSubmit={async (data) => {

                    if (!identity) return;
                    const category = (products ?? []).find((p) => p.id === data.category);

                    if (!props.id) {
                        const item = Product.fromPrimitives({
                            id: UuidUtils.persistenceUuid(),
                            name: data.name,
                            available: Boolean(data.available),
                            description: data.description,
                            imageUrl: '',
                            createdAt: new Date(),
                            status: 'ACTIVE',
                            unity: data.unity,
                            price: data.price,
                            restaurantId: identity.restaurantId,
                            category: category as any
                        });

                        await save(item, {
                            imageUrl: data.imageUrl
                        });
                        props?.onSave?.();

                        notify('Producto guardado exitosamente', 'success');
                        return;
                    }

                    if (!props.item) return;

                    const item: Product = props.item;

                    item.updateInfo({
                        description: data.description,
                        available: Boolean(data.available),
                        name: data.name,
                        unity: data.unity,
                        price: data.price,
                        category: category as any
                    });

                    await save(item, {
                        imageUrl: data.imageUrl
                    });

                    props?.onSave?.();

                    notify('Producto guardado exitosamente', 'success');
                }}
            />
        </Box>
    );
}

