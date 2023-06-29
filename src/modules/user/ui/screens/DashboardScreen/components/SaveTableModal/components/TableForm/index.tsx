import { Form } from '@main-components/Form/Form';
import TextInput from '@main-components/Form/inputs/TextInput';
import { Box } from '@main-components/Base/Box';
import { minValue, required } from '@shared/domain/form/validate';
import useNotify from '@shared/domain/hooks/use-notify';
import SaveButton from '@main-components/Form/components/SaveButton';
import AppIcon from '@main-components/Base/AppIcon';
import { BaseInput } from '@main-components/Form/inputs/BaseInput';
import SelectInput from '@main-components/Form/inputs/SelectInput';
import WeekScheduleInput, { isValidSchedule } from '@main-components/Form/inputs/WeekScheduleInput';
import useFindRestaurantAreas from '@modules/tables/application/use-find-restaurant-areas';
import RestaurantArea from '@modules/tables/domain/models/restaurant-area';
import RestaurantTable from '@modules/tables/domain/models/restaurant-table';
import UuidUtils from '@utils/misc/uuid-utils';
import useUpdateRestaurantArea from '@modules/tables/application/use-update-restaurant-area';
import { onlyNumbers } from '@shared/domain/form/filters';
import { Button } from '@main-components/Base/Button';
import { Icon } from '@main-components/Base/Icon';
import * as React from 'react';
import { useState } from 'react';
import useFindTableSchedules from '@modules/tables/application/schedules/use-find-table-schedules';
import { useForm } from '@shared/domain/form/useForm';
import Text from '@main-components/Typography/Text';
import { Link } from '@main-components/Base/Link';


interface TableFormProps {
    item?: {
        id: string;
        areaId: string
    };
    defaultValues?: any;
    onSave?: any;
    areas?: RestaurantArea[];
    table?: RestaurantTable;
}

export default function TableForm(props: TableFormProps) {
    const table = props.table;

    return (
        <Form
            defaultValues={{
                ...props.defaultValues,
                ...table?.toPrimitives(),
                areaId: props?.item?.areaId
            }}
            toolbar={
                <FormToolbar
                    id={props?.item?.id}
                    areas={props.areas ?? []}
                    areaId={props?.item?.areaId}
                    onSave={props.onSave}
                />
            }
        >
            <Box flexDirection={'row'}>
                <Box
                    mr={'m'}
                    flex={0.5}
                >
                    <TextInput
                        required
                        validate={[
                            required(),
                            minValue(1, 'Mínimo 1 persona')
                        ]}
                        filterText={onlyNumbers}
                        label={'Nro de Personas'}
                        source={'capacity'}
                    />
                </Box>

                <Box flex={0.5}>
                    <BaseInput
                        WrapperComponent={Box}
                        label={'Duración de reserva'}
                        bg={'white'}
                        required
                    >
                        <Box
                            flexDirection={'row'}
                        >
                            <Box
                                mr={'m'}
                                flex={0.5}
                            >
                                <TextInput
                                    noMargin
                                    required
                                    placeholder={'Horas'}
                                    filterText={onlyNumbers}
                                    validate={required()}
                                    source={'reservationDuration.hours'}
                                />
                            </Box>
                            <Box flex={0.5}>
                                <TextInput
                                    noMargin
                                    required
                                    placeholder={'Minutos'}
                                    filterText={onlyNumbers}
                                    validate={required()}
                                    source={'reservationDuration.minutes'}
                                />
                            </Box>
                        </Box>
                    </BaseInput>

                </Box>
            </Box>


            <WeekScheduleInput
                header={() => {
                    return (
                        <TableSchedulePicker
                            source={'templateSchedule'}

                            helperText={<Box
                                flexDirection={'row'}
                                justifyContent={'center'}
                                alignItems={'center'}
                            >
                                <Text variant={'small'}>Selecciona un horario predefinido</Text>
                                <Box ml={'s'}>
                                    <Link
                                        label={'Ver configuraciones'}
                                        href={'/settings'}
                                        target={'_blank'}
                                        textProps={{
                                            variant: 'small',
                                            color: 'infoMain'
                                        }}
                                    />
                                </Box>
                            </Box>}
                        />
                    );
                }}
                source={'schedule'}
                label={'Disponibilidad'}
                required
                validate={isValidSchedule('Horario inválido')}
            />

            <RestaurantAreaSelectInput
                required
                validate={[
                    required()
                ]}
                label={'Area'}
                source={'areaId'}
            />

        </Form>
    );
}

function RestaurantAreaSelectInput(props) {
    const { data: areas, ids, loading: loadingAreas } = useFindRestaurantAreas();

    return (
        <SelectInput
            {...props}

            choices={ids?.map(id => {
                const area = areas?.[id];
                return {
                    id: id,
                    name: area?.name
                };
            })}
        />

    );
}

function TableSchedulePicker(props) {
    const { data: items, ids, loading: loadingAreas } = useFindTableSchedules();

    const { setValue } = useForm();
    return (
        <SelectInput
            {...props}
            placeholder={'Selecciona un horario base'}
            choices={ids?.map(id => {
                const item = items?.[id];
                return {
                    id: id,
                    name: item?.name
                };
            })}
            onChange={(id) => {
                if (!id) {
                    setValue('schedule', '');

                    return;
                }
                if (!items) return;
                const selectedSchedule = items[id].schedule;
                setValue('schedule', selectedSchedule);
            }}
        />
    );
}

function FormToolbar(props) {

    const notify = useNotify();

    const { save: update, loading: updating } = useUpdateRestaurantArea();
    const [updatingIndicator, setUpdatingIndicator] = useState(false);

    return (
        <Box alignItems={'center'}>
            <SaveButton
                {...props}
                label='Guardar'
                titleColor={'white'}
                loading={updating && updatingIndicator}
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

                    const areas: RestaurantArea[] = props.areas ?? [];
                    const item = areas?.find(a => a.id == data.areaId);

                    if (!item) return;

                    if (props.id) {
                        const table = item.findTable(props.id);
                        if (!table) return;

                        table.updateDetails({
                            number: table.number,
                            areaId: data.areaId,
                            capacity: parseInt(data.capacity),
                            reservationDuration: {
                                hours: parseInt(data.reservationDuration.hours),
                                minutes: parseInt(data.reservationDuration.minutes)
                            },
                            schedule: data.schedule
                        });

                        item.updateTable(table);

                    } else {
                        item.createTable(RestaurantTable.fromPrimitives({
                            id: UuidUtils.persistenceUuid(),
                            number: item.tables?.length + 1,
                            areaId: data.areaId,
                            capacity: parseInt(data.capacity),
                            reservationDuration: {
                                hours: parseInt(data.reservationDuration.hours),
                                minutes: parseInt(data.reservationDuration.minutes)
                            },
                            schedule: data.schedule
                        }));
                    }

                    setUpdatingIndicator(true);

                    try {

                        await update(item.id, item);

                        props?.onSave?.();
                        notify('Guardado exitosamente', 'success');
                    } finally {
                        setUpdatingIndicator(false);
                    }

                }}
            />
            {
                !!props.id && (
                    <Box
                        borderTopWidth={1}
                        borderColor={'greyLight'}
                        mt={'m'}
                        paddingVertical={'m'}
                    >

                        <ConfirmButton
                            loading={updating}
                            onConfirm={async () => {
                                const item: RestaurantArea = props.area;
                                item.deleteTable(props.id);
                                await update(item.id, item);
                                props?.onSave?.();
                                notify('Mesa eliminada exitosamente', 'success');
                            }}
                        />

                    </Box>
                )
            }
        </Box>
    );
}

function ConfirmButton({ onConfirm, ...rest }) {
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <Box flexDirection={'row'}>
            {
                showConfirm ? (
                    <>
                        <Box
                            borderRightWidth={1}
                            mr={'m'}
                            pr={'s'}
                        >
                            <Button
                                mode={'text'}
                                icon={() => {
                                    return (
                                        <Icon
                                            name={'close'}
                                            type={'ionicon'}
                                            color={'black'}
                                            numberSize={20}
                                        />
                                    );
                                }}
                                titleColor={'black'}
                                title={'Cancelar'}
                                onPress={() => {
                                    setShowConfirm(false);
                                }}
                            />
                        </Box>
                        <Box>
                            <Button
                                mode={'text'}
                                {...rest}
                                icon={() => {
                                    return (
                                        <Icon
                                            name={'check'}
                                            type={'feather'}
                                            color={'dangerMain'}
                                            numberSize={20}
                                        />
                                    );
                                }}
                                titleColor={'dangerMain'}
                                title={'Confirmar'}
                                onPress={() => {
                                    onConfirm();
                                }}
                            />
                        </Box>
                    </>
                ) : (
                    <Button
                        mode={'text'}
                        icon={() => {
                            return (
                                <Icon
                                    name={'trash'}
                                    type={'feather'}
                                    color={'dangerMain'}
                                    numberSize={20}
                                />
                            );
                        }}
                        titleColor={'dangerMain'}
                        title={'Eliminar mesa'}
                        onPress={() => {
                            setShowConfirm(true);
                        }}
                    />
                )

            }
        </Box>
    );
}

