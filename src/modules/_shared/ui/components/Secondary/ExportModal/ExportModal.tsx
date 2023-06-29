import { Box, IconButton, Modal } from '@main-components/Base';
import { Platform } from 'react-native';
import Text from '@main-components/Typography/Text';
import Form from '@main-components/Form';
import TextInput from '@main-components/Form/inputs/TextInput';
import { email, required } from '@shared/domain/form/validate';
import React, { useMemo } from 'react';
import useGetIdentity from '@modules/auth/application/use-get-identity';

export function ExportModal({ onDismiss, visible, title, onSubmit, loading }) {

    const { identity: user } = useGetIdentity();

    const defaultValues = useMemo(() => {
        return {
            email: user?.email
        };
    }, [user?.email]);
    return (
        <Modal
            onDismiss={onDismiss}
            visible={visible}
            contentContainerStyle={{
                width: Platform.select({
                    web: '30%'
                }),
                alignSelf: 'center',
                padding: 0
            }}
        >
            <Box
                padding='m'
                borderRadius={20}
                bg='white'
            >
                <Box
                    mb='m'
                    justifyContent='space-between'
                    alignItems='center'
                    flexDirection={'row'}
                >
                    <Box>
                        <Text
                            bold
                            color='textColor'
                            variant={'body'}
                        >
                            {title}
                        </Text>
                    </Box>
                    <Box>

                        <IconButton
                            iconName={'times'}
                            iconColor={'textColor'}
                            iconType={'font-awesome-5'}
                            iconSize={20}
                            onPress={onDismiss}
                        />
                    </Box>
                </Box>
                <Form
                    saveButtonProps={{
                        label: 'Exportar',
                        uppercase: false,
                        loading: loading
                    }}
                    defaultValues={defaultValues}
                    onSubmit={onSubmit}
                >
                    <TextInput
                        label='Enviar al email'
                        mode='rounded'
                        labelColor='primaryDark'
                        validate={[required('Ingresa el email'), email('Ingresa un email válido')]}
                        source='email'
                        placeholder='Ingresa tu email'
                        bg={'white'}
                    />
                </Form>
            </Box>
        </Modal>
    );
}