import { Form } from '@main-components/Form/Form';
import TextInput from '@main-components/Form/inputs/TextInput';
import { Box } from '@main-components/Base/Box';
import { required } from '@shared/domain/form/validate';
import SaveButton from '@main-components/Form/components/SaveButton';
import AppIcon from '@main-components/Base/AppIcon';
import React from 'react';
import UuidUtils from '@utils/misc/uuid-utils';
import useNotify from '@shared/domain/hooks/use-notify';

import { BaseInput } from '@main-components/Form/inputs/BaseInput';
import DateInput from '@main-components/Form/inputs/DateInput';
import CheckboxInput from '@main-components/Form/inputs/CheckboxInput';
import Promotion from '@modules/user/domain/models/promotion';
import {
    PromotionImageInput
} from '@modules/user/ui/screens/PromotionsScreen/components/SavePromotionModal/components/PromotionForm/components/PromotionImageInput';
import useSavePromotion from '@modules/user/application/promotions/use-save-promotion';
import MallsSelectInput
    from '@modules/user/ui/screens/PromotionsScreen/components/SavePromotionModal/components/PromotionForm/components/MallsSelectInput';
import useGetIdentity from '@modules/auth/application/use-get-identity';

interface PromotionFormProps {
    id?: string;
    defaultValues?: any;
    onSave: any;
    item?: Promotion;
}


export default function PromotionForm(props: PromotionFormProps) {
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
                        label={'Título de la Promoción'}
                        source={'name'}
                    />
                    <TextInput
                        multiline
                        required
                        validate={required()}
                        label={'Descripción'}
                        source={'description'}
                    />

                    <MallsSelectInput
                        required
                        validate={required()}
                        label={'Plazas'}
                        source={'mallsIds'}
                    />

                    <BaseInput
                        WrapperComponent={Box}
                        label={'Duración de la Promoción'}
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
                                <DateInput
                                    noMargin
                                    required
                                    helperText={'Inicio'}
                                    placeholder={'Horas'}
                                    validate={required()}
                                    source={'duration.start'}
                                />
                            </Box>
                            <Box flex={0.5}>
                                <DateInput
                                    noMargin
                                    required
                                    helperText={'Fin'}
                                    placeholder={'Horas'}
                                    validate={required()}
                                    source={'duration.end'}
                                />
                            </Box>
                        </Box>
                    </BaseInput>
                </Box>
                <Box flex={0.5}>
                    <PromotionImageInput
                        label={'Imagen de la Promoción'}
                        helperText={'Aspecto 2:1. Min: 800px x 400px'}
                    />
                </Box>
            </Box>


        </Form>
    );
}

function FormToolbar(props) {
    const { execute: save, loading } = useSavePromotion();
    const notify = useNotify();
    const { identity } = useGetIdentity();

    return (
        <Box alignItems={'center'}>
            <SaveButton
                {...props}
                label='Guardar'
                titleColor={'white'}
                loading={loading}
                backgroundColor={'contrastLight'}
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
                        const promotion = Promotion.fromPrimitives({
                            id: UuidUtils.persistenceUuid(),
                            name: data.name,
                            available: Boolean(data.available),
                            duration: {
                                start: data.duration.start,
                                end: data.duration.end
                            },
                            mallsIds: data.mallsIds,
                            description: data.description,
                            imageUrl: '',
                            createdAt: new Date(),
                            status: 'ACTIVE',
                            restaurantId: identity.restaurantId
                        });

                        await save(promotion, {
                            imageUrl: data.imageUrl
                        });
                        props?.onSave?.();

                        notify('Promoción guardada exitosamente', 'success');
                        return;
                    }

                    if (!props.item) return;

                    const promotion: Promotion = props.item;

                    promotion.updateInfo({
                        description: data.description,
                        mallsIds: data.mallsIds,
                        duration: {
                            start: data.duration.start,
                            end: data.duration.end
                        },
                        available: Boolean(data.available),
                        name: data.name,
                        restaurantId: identity.restaurantId
                    });

                    await save(promotion, {
                        imageUrl: data.imageUrl
                    });
                    props?.onSave?.();

                    notify('Promoción guardada exitosamente', 'success');
                }}
            />
        </Box>
    );
}

