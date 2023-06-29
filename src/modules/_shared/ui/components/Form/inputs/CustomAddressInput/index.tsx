import { AddressAutocompleteInput } from '@main-components/Form/inputs/AddressAutocompleteInput';
import TextInput from '@main-components/Form/inputs/TextInput';
import Form from '@main-components/Form';
import React, { useEffect, useState } from 'react';
import { Box, IconButton, Modal } from '@main-components/Base';
import StateSelectInput from '@modules/user/ui/components/StateSelectInput';
import CitySelectInput from '@modules/user/ui/components/CitySelectInput';
import { required } from '@shared/domain/form/validate';
import { useForm } from '@shared/domain/form/useForm';
import Text from '@main-components/Typography/Text';
import useFormFieldErrors from '@shared/domain/form/use-form-field-errors';

export function CustomAddressInput(props) {
    const [showModal, setShowModal] = useState(false);

    const { hasError, error: coordsError } = useFormFieldErrors('vendorLocation.coords');
    const { setError, errors } = useForm();

    useEffect(() => {
        if (coordsError) {
            setError(props.source, {
                message: 'Por favor, rellena la latitud y longitud'
            });
        }
    }, [coordsError, errors]);

    return (
        <Box>
            <Box
                disabled
                onClick={(e) => {
                    if (props.disabled) return;
                    setShowModal(true);
                }}
            >

                <TextInput
                    bg={'white'}
                    multiline
                    numberOfLines={props?.numberOfLines ?? 4}
                    value={props.value}
                    validate={props.validate}
                    required={props.required}
                    source={props.source}
                    label={props.label}
                    placeholder={props.placeholder}
                    disabled={true}
                />

            </Box>
            <AddressModalForm
                open={showModal}
                showCoords={props.showCoords}
                formDefaultValues={props.formDefaultValues}
                onSubmit={props.onSubmit}
                onClose={() => setShowModal(false)}
            />
        </Box>
    );
}

function AddressModalForm({ open, onClose, formDefaultValues, onSubmit, showCoords }) {

    function parseJson(string) {
        try {
            return JSON.parse(string);
        } catch (e) {
            return {};
        }
    }

    function AddressController() {
        const { watch, setValue } = useForm();
        const address = watch('addressValue');

        useEffect(() => {
            setValues({
                ...formDefaultValues
            });
        }, [formDefaultValues]);


        useEffect(() => {
            if (!address) return;
            const location = address == '' ? null : parseJson(address);


            const defaultAddress = formDefaultValues.addressValue ? JSON.parse(formDefaultValues.addressValue)?.address : '';

            if (formDefaultValues && location?.address == defaultAddress) {
                return;
            }

            setValues({
                ...location.coords
            });
        }, [address, formDefaultValues]);


        function setValues(location) {
            if (!location) return;
            setValue('line1Value', location.line1);
            setValue('line2Value', location.line2);
            setValue('stateValue', location.state);
            setValue('latitudeValue', location.latitude);
            setValue('longitudeValue', location.longitude);
            setValue('cityValue', location.city);
        }

        return (
            <>
                <Box mb={'m'}>
                    <Text>Refinar dirección:</Text>
                </Box>

                <TextInput
                    source={'line1Value'}
                    required
                    validate={required()}
                    label={'(Calle, Avenida, Urbanización, Ciudad, Estado...)'}
                />

                <TextInput
                    source={'line2Value'}
                    label={'(Nro Casa, Nro Apto.)'}
                />

                <StateSelectInput
                    label={'Estado'}
                    source={'stateValue'}
                    dependant='cityValue'
                    validate={required()}
                    required
                />

                <CitySelectInput
                    label='Ciudad'
                    labelColor='primaryDark'
                    depends='stateValue'
                    validate={required('Coloca la ciudad')}
                    source={'cityValue'}
                    required
                />

                {
                    !!showCoords && (
                        <>
                            <Box flexDirection={'row'}>
                                <Box
                                    flex={0.5}
                                    mr={'s'}
                                >
                                    <TextInput
                                        source={'latitudeValue'}
                                        label={'Latitud'}
                                        required
                                        validate={required('Coloca la latitud')}
                                    />
                                </Box>
                                <Box flex={0.5}>
                                    <TextInput
                                        source={'longitudeValue'}
                                        label={'Longitud'}
                                        required
                                        validate={required('Coloca la longitud')}
                                    />
                                </Box>


                            </Box>

                        </>
                    )
                }
            </>
        );
    }


    const coords = parseJson(formDefaultValues?.locationCoords);
    return (
        <Modal
            contentContainerStyle={{
                maxWidth: 400
            }}
            visible={open}
            onClose={onClose}
        >
            <Box
                maxWidth={500}
                borderRadius={5}
            >
                <Box
                    justifyContent={'space-between'}
                    mb={'s'}
                    alignItems={'center'}
                    flexDirection={'row'}
                >
                    <Text
                        color={'black'}
                        variant={'heading3'}
                        bold
                    >Seleccciona</Text>

                    <Box>
                        <IconButton
                            iconName={'times'}
                            onPress={onClose}
                            iconColor={'greyMain'}
                        />
                    </Box>
                </Box>
                <Form
                    defaultValues={{
                        ...formDefaultValues,
                        ...(showCoords && {
                            latitudeValue: coords?.latitude,
                            longitudeValue: coords?.longitude
                        })
                    }}
                    onSubmit={(values) => {

                        const location = values?.addressValue ? JSON.parse(values?.addressValue) : undefined;
                        onClose();
                        onSubmit({
                            coords: values.latitudeValue ? {
                                latitude: values.latitudeValue,
                                longitude: values.longitudeValue
                            } : undefined,
                            country: location?.coords?.country ?? 'VE',
                            address: location?.address,
                            state: values?.stateValue,
                            city: values?.cityValue,
                            line1: values?.line1Value,
                            line2: values?.line2Value
                        });
                    }}
                    saveButtonProps={{
                        label: 'Aceptar'
                    }}
                >
                    <Box mb={'m'}>
                        <Text>Buscar ubicación:</Text>
                    </Box>
                    <AddressAutocompleteInput
                        source={'addressValue'}
                    />

                    <AddressController />
                </Form>
            </Box>
        </Modal>
    );
}