import { Form } from '@main-components/Form/Form';
import TextInput from '@main-components/Form/inputs/TextInput';
import { Box } from '@main-components/Base/Box';
import { required } from '@shared/domain/form/validate';
import SaveButton from '@main-components/Form/components/SaveButton';
import AppIcon from '@main-components/Base/AppIcon';
import React from 'react';
import UuidUtils from '@utils/misc/uuid-utils';
import useNotify from '@shared/domain/hooks/use-notify';
import useCreateTableSchedule from '@modules/tables/application/schedules/use-create-table-schedule';
import useUpdateTableSchedule from '@modules/tables/application/schedules/use-update-table-schedule';
import TableSchedule from '@modules/tables/domain/models/table-schedule';
import UserIdentity from '@modules/auth/domain/models/user-identity';
import WeekScheduleInput, { isValidSchedule } from '@main-components/Form/inputs/WeekScheduleInput';

interface TableScheduleFormProps {
    id?: string;
    defaultValues?: any;
    onSave: any;
    user?: UserIdentity;
    item?: TableSchedule;
}


export default function TableScheduleForm(props: TableScheduleFormProps) {

    return (
            <Form
                    defaultValues={props.defaultValues}
                    toolbar={
                        <FormToolbar
                                id={props.id}
                                item={props.item}
                                user={props.user}
                                onSave={props.onSave}
                        />
                    }
            >
                <Box
                        flexDirection={'column'}
                >
                    <TextInput
                            required
                            validate={required()}
                            label={'Nombre'}
                            source={'name'}
                    />
                    <WeekScheduleInput
                            source={'schedule'}
                            label={'Horario'}
                            required
                            validate={isValidSchedule('Horario inválido')}
                    />
                </Box>
            </Form>
    );
}

function FormToolbar(props) {
    const { save: create, loading } = useCreateTableSchedule();
    const { save: update, loading: updating } = useUpdateTableSchedule();

    const notify = useNotify();

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

                            if (!props?.id) {

                                const newSchedule = TableSchedule.fromPrimitives({
                                    id: UuidUtils.persistenceUuid(),
                                    name: data.name,
                                    schedule: data.schedule,
                                    restaurantId: props.user.restaurantId
                                });

                                await create(newSchedule);
                                props?.onSave?.();
                                notify('Horario guardado exitosamente', 'success');

                                return;
                            }

                            if (!props.item) return;

                            const item: TableSchedule = props.item;
                            item.updateDetails(data);
                            await update(item.id, item);
                            props?.onSave?.();
                            notify('Horario guardado exitosamente', 'success');

                        }}
                />
            </Box>
    );
}

