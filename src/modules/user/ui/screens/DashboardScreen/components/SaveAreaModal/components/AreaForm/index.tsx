import { Form } from '@main-components/Form/Form';
import TextInput from '@main-components/Form/inputs/TextInput';
import { Box } from '@main-components/Base/Box';
import { required } from '@shared/domain/form/validate';
import useNotify from '@shared/domain/hooks/use-notify';
import SaveButton from '@main-components/Form/components/SaveButton';
import AppIcon from '@main-components/Base/AppIcon';
import useCreateRestaurantArea from '@modules/tables/application/use-create-restaurant-area';
import useUpdateRestaurantArea from '@modules/tables/application/use-update-restaurant-area';
import RestaurantArea from '@modules/tables/domain/models/restaurant-area';
import UuidUtils from '@utils/misc/uuid-utils';
import UserIdentity from '@modules/auth/domain/models/user-identity';


interface AreaFormProps {
    id?: string;
    defaultValues?: any;
    onSave?: any;
    user?: UserIdentity;
    area?: RestaurantArea;
}

export default function AreaForm(props: AreaFormProps) {

    return (
        <Form
            defaultValues={{
                ...props.area?.toPrimitives()
                //...props.defaultValues
            }}
            toolbar={
                <FormToolbar
                    area={props.area}
                    user={props.user}
                    id={props.id}
                    onSave={props.onSave}
                />
            }
        >
            <TextInput
                required
                validate={required()}
                label={'Nombre'}
                source={'name'}
            />
        </Form>
    );
}


function FormToolbar(props) {

    const notify = useNotify();
    const { save, loading: saving } = useCreateRestaurantArea();
    const { save: update, loading: updating } = useUpdateRestaurantArea();

    return (
        <Box alignItems={'center'}>
            <SaveButton
                {...props}
                label='Guardar'
                titleColor={'white'}
                loading={saving || updating}
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
                    if (!props.user) return;

                    if (props.id) {
                        if (!props.area) return;
                        const area: RestaurantArea = props.area;
                        area.updateName(data.name);
                        await update(area.id, area);

                        props?.onSave?.();
                        notify('Guardado exitosamente', 'success');
                        return;
                    }

                    const newArea = RestaurantArea.fromPrimitives({
                        id: UuidUtils.persistenceUuid(),
                        name: data.name,
                        restaurantId: props.user.restaurantId,
                        tables: []
                    });

                    await save(newArea);
                    props?.onSave?.();
                    notify('Guardado exitosamente', 'success');
                }}
            />
        </Box>
    );
}

