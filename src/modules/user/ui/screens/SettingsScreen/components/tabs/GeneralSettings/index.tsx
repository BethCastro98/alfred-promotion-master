import useGetIdentity from '@modules/auth/application/use-get-identity';
import useGetRestaurantById from '@modules/user/application/use-get-restaurant-by-id';
import useFindUser from '@modules/user/application/accounts/use-find-user';
import { Box } from '@main-components/Base/Box';
import { Form } from '@main-components/Form/Form';
import { RestaurantLogoInput } from '@modules/user/ui/screens/SettingsScreen/components/RestaurantLogoInput';
import {
    RestaurantCoverImageInput
} from '@modules/user/ui/screens/SettingsScreen/components/RestaurantCoverImageInput';
import TextInput from '@main-components/Form/inputs/TextInput';
import { email, minLength, required } from '@shared/domain/form/validate';
import RestaurantCategorySelectInput
    from '@modules/user/ui/screens/SettingsScreen/components/RestaurantCategorySelectInput';
import WeekScheduleInput, { isValidSchedule } from '@main-components/Form/inputs/WeekScheduleInput';
import PasswordInput from '@main-components/Form/inputs/PasswordInput';
import React from 'react';
import useNotify from '@shared/domain/hooks/use-notify';
import useUpdateRestaurant from '@modules/user/application/use-update-restaurant';
import useSaveUser from '@modules/user/application/accounts/use-save-user';
import useLogout from '@modules/auth/application/use-logout';
import SaveButton from '@main-components/Form/components/SaveButton';
import AppIcon from '@main-components/Base/AppIcon';
import Restaurant from '@modules/user/domain/models/restaurant';
import AccountUser from '@modules/user/domain/models/account-user';
import ObjectUtils from '@utils/misc/object-utils';
import RestaurantMallSelectInput from '@modules/user/ui/screens/PromotionsScreen/components/RestaurantMallSelectInput';

export function GeneralSettings() {
    const { identity } = useGetIdentity();
    const { data: restaurant } = useGetRestaurantById(identity?.restaurantId, { enabled: !!identity });
    const { data: currentUser } = useFindUser(identity?.id, { enabled: !!identity });
    const dto = restaurant?.toPrimitives();

    return (
        <Box flexDirection={'row'}>
            <Box
                maxWidth={700}
                width={'100%'}
            >
                <Form
                    toolbar={
                        <FormToolbar
                            restaurant={restaurant}
                            currentUser={currentUser}
                        />
                    }
                    defaultValues={{
                        schedule: dto?.schedule,
                        description: dto?.description,
                        name: restaurant?.name,
                        categoriesIds: restaurant?.categoriesIds,
                        notificationEmail: restaurant?.notificationEmail,
                        logoUrl: restaurant?.logoUrl,
                        coverImageUrl: restaurant?.coverImageUrl,
                        credentials: {
                            password: undefined
                        },
                        mallId: restaurant?.mallId
                    }}
                >
                    <Box
                        alignItems={'center'}
                        justifyContent={'space-between'}
                        flexDirection={'row'}
                    >
                        <RestaurantLogoInput
                            label={'Logo'}
                            helperText={'Aspecto 1:1. Min: 250px x 250px'}
                        />

                        <RestaurantCoverImageInput
                            label={'Cover'}
                            helperText={'Aspecto 2:1. Min: 800px x 400px'}
                        />
                    </Box>

                    <TextInput
                        required
                        validate={[
                            required()
                        ]}
                        label={'Nombre del negocio'}
                        source={'name'}
                    />

                    <TextInput
                        multiline
                        required
                        validate={required()}
                        label={'Descripción'}
                        source={'description'}
                    />

                    <RestaurantMallSelectInput
                        source={'mallId'}
                        placeholder={'Plaza'}
                        disabled
                        label={'Plaza'}
                        required
                    />

                    <RestaurantCategorySelectInput
                        required
                        validate={required()}
                        label={'Categorías del restaurante'}
                        source={'categoriesIds'}
                    />
                    <TextInput
                        validate={[
                            email()
                        ]}
                        label={'Correo de notificación'}
                        source={'notificationEmail'}
                    />

                    <WeekScheduleInput
                        source={'schedule'}
                        label={'Disponibilidad'}
                        required
                        validate={isValidSchedule('Horario inválido')}
                    />

                    <PasswordInput
                        label={'Cambiar contraseña'}
                        source={'credentials.password'}
                        validate={[
                            minLength(8, 'Por favor, ingresa una clave de al menos 8 caracteres')
                        ]}
                    />

                </Form>
            </Box>
        </Box>
    );
}


function FormToolbar(props) {
    const notify = useNotify();
    const { save: updateRestaurant, loading: updatingRestaurant } = useUpdateRestaurant();
    const { execute: saveUser, loading: updatingUser } = useSaveUser();
    const loading = updatingRestaurant || updatingUser;

    const { logout } = useLogout();
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

                    if (!props.restaurant) return;
                    if (!props.currentUser) return;

                    const restaurant: Restaurant = props.restaurant;
                    const currentUser: AccountUser = props.currentUser;


                    restaurant.updateProfile(ObjectUtils.omit(data, ['credentials']));

                    await updateRestaurant(props.restaurant.id, props.restaurant);

                    const changedCredentials = !!data.credentials && (!!data.credentials.email || !!data.credentials.password);
                    if (changedCredentials) {
                        currentUser.updateCredentials(data.credentials);
                        await saveUser(currentUser);
                        notify('Datos actualizados. Tu clave a cambiado, por favor inicia sesión nuevamente', 'success');
                        await logout();
                        return;
                    }

                    props?.onSave?.();

                    notify('Guardado exitosamente', 'success');
                }}
            />
        </Box>
    );
}
