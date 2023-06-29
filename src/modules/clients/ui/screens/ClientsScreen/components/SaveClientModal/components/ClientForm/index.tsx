import { Form } from '@main-components/Form/Form';
import TextInput from '@main-components/Form/inputs/TextInput';
import { Box } from '@main-components/Base/Box';
import { email, required } from '@shared/domain/form/validate';
import SaveButton from '@main-components/Form/components/SaveButton';
import AppIcon from '@main-components/Base/AppIcon';
import React from 'react';
import UuidUtils from '@utils/misc/uuid-utils';
import useNotify from '@shared/domain/hooks/use-notify';
import Product from '@modules/user/domain/models/product';
import Client from '@modules/clients/domain/models/client';
import useCreateClient from '@modules/clients/application/use-create-client';
import useUpdateClient from '@modules/clients/application/use-update-client';
import PhoneTextInput from '@main-components/Form/inputs/PhoneTextInput';
import {
    ClientImageInput
} from '@modules/clients/ui/screens/ClientsScreen/components/SaveClientModal/components/ClientForm/components/ClientImageInput';
import useFindRestaurantMalls from '@modules/user/application/malls/use-find-restaurant-malls';
import SelectInput from '@main-components/Form/inputs/SelectInput';
import useFindRestaurantAreas from '@modules/tables/application/use-find-restaurant-areas';
import useGetIdentity from '@modules/auth/application/use-get-identity';

interface ClientFormProps {
    id?: string;
    defaultValues?: any;
    onSave: any;
    item?: Product;
}


export default function ClientForm(props: ClientFormProps) {
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

                <ClientImageInput helperText={'Aspecto 1:1. Min: 200px x 200px'} />

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
                                source={'firstName'}
                        />


                    </Box>

                    <Box flex={0.5}>
                        <TextInput
                                required
                                validate={required()}
                                label={'Apellido'}
                                source={'lastName'}
                        />
                    </Box>
                </Box>

                <TextInput
                        label={'Alergias'}
                        source={'allergies'}
                />

                <TextInput
                        required
                        validate={[
                            required(),
                            email('Email inválido')
                        ]}
                        label={'Correo'}
                        source={'email'}
                />

                <PhoneTextInput
                        required
                        validate={[
                            required()
                        ]}
                        label={'Número de contacto'}
                        source={'phone'}
                />

                <FavoriteTableInput
                        label={'Mesa favorita'}
                        source={'favoriteTable'}
                />

            </Form>
    );
}

function FormToolbar(props) {
    const { save, loading } = useCreateClient();
    const { save: update, loading: updating } = useUpdateClient();
    const notify = useNotify();
    const { identity } = useGetIdentity();

    return (
            <Box alignItems={'center'}>
                <SaveButton
                        {...props}
                        label='Guardar'
                        titleColor={'white'}
                        loading={loading || updating}
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
                            if (!props.id) {
                                const item = Client.fromPrimitives({
                                    id: UuidUtils.persistenceUuid(),
                                    firstName: data.firstName,
                                    status: 'ACTIVE',
                                    lastName: data.lastName,
                                    allergies: data.allergies,
                                    email: data.email,
                                    phone: data.phone,
                                    imageUrl: data.imageUrl,
                                    favoriteTable: data.favoriteTable,
                                    restaurantId: identity.restaurantId
                                });

                                await save(item);
                                props?.onSave?.();

                                notify('Cliente creado exitosamente', 'success');
                                return;
                            }

                            if (!props.item) return;

                            const item: Client = props.item;

                            item.updateInfo({
                                firstName: data.firstName,
                                lastName: data.lastName,
                                allergies: data.allergies,
                                phone: data.phone,
                                favoriteTable: data.favoriteTable,
                                imageUrl: data.imageUrl
                            });

                            await update('*', item);

                            props?.onSave?.();

                            notify('Cliente guardado exitosamente', 'success');
                        }}
                />
            </Box>
    );
}


function FavoriteTableInput(props: any) {
    const { data, loading } = useFindRestaurantMalls();
    const { data: areas, ids, loading: loadingAreas } = useFindRestaurantAreas();

    const items = ids?.reduce((curr, el) => {
        const area = areas[el];
        const tables = area.tables;

        return [
            ...curr,
            ...tables.map(t => {
                return {
                    id: t.id,
                    name: `${area.name} - Mesa ${t.number}`
                };
            })
        ];
    }, []);

    return (
            <SelectInput
                    {...props}
                    choices={items}
            />
    );
}

