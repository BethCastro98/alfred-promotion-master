import { Form } from '@main-components/Form/Form';
import TextInput from '@main-components/Form/inputs/TextInput';
import { Box } from '@main-components/Base/Box';
import Text from '@main-components/Typography/Text';
import { email, minLength, required } from '@shared/domain/form/validate';
import useNotify from '@shared/domain/hooks/use-notify';
import SaveButton from '@main-components/Form/components/SaveButton';
import AppIcon from '@main-components/Base/AppIcon';
import UuidUtils from '@utils/misc/uuid-utils';
import React from 'react';
import AccountUser from '@modules/user/domain/models/account-user';
import PasswordInput from '@main-components/Form/inputs/PasswordInput';
import useSaveUser from '@modules/user/application/accounts/use-save-user';
import SelectInput from '@main-components/Form/inputs/SelectInput';

interface UserFormProps {
    id?: string;
    defaultValues?: any;
    onSave?: any;
    user?: AccountUser;
}

export default function UserForm(props: UserFormProps) {

    return (
            <Form
                    defaultValues={{
                        ...props.defaultValues,
                        ...props.user?.toPrimitives()
                    }}
                    toolbar={
                        <FormToolbar
                                id={props.id}
                                onSave={props.onSave}
                        />
                    }
            >
                <BasicFormInputs editMode={!!props.id} />
            </Form>
    );
}

export function BasicFormInputs({ editMode }) {
    return (
            <>
                <Box
                        flexDirection={'row'}
                >
                    <Box
                            flex={0.5}
                            mr={'m'}
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
                        required
                        disabled={editMode}
                        validate={[
                            required(),
                            email()
                        ]}
                        label={'Email'}
                        source={'email'}
                />

                <SelectInput
                        required
                        choices={[{ id: 'ADMIN', name: 'Administrador' }, {
                            id: 'ADM.PROMOTOR',
                            name: 'Adm.Promotor'
                        }]}
                        validate={[
                            required()
                        ]}
                        label={'Permisos'}
                        source={'type'}
                />

                {
                        !editMode && (
                                <PasswordInput
                                        required
                                        placeholder={'Mínimo 8 caracteres'}
                                        validate={[
                                            required(),
                                            minLength(8, 'Mínimo 8 caracteres')
                                        ]}
                                        label={'Clave'}
                                        source={'password'}
                                />
                        )
                }

            </>
    );
}

function FormToolbar(props) {
    const { execute: save, loading } = useSaveUser();
    const notify = useNotify();

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

                            const user = AccountUser.fromPrimitives({
                                id: props?.id ?? UuidUtils.persistenceUuid(),
                                firstName: data.firstName,
                                lastName: data.lastName,
                                status: 'ACTIVE',
                                roles: ['USER'],
                                type: data.type,
                                email: data.email,
                                credentials: data.password ? {
                                    email: data.email,
                                    password: data.password
                                } : undefined
                            });

                            await save(user);

                            props?.onSave?.();

                            notify('Guardado exitosamente', 'success');
                        }}
                />
            </Box>
    );
}


function Section({ title, subtitle }: { title: string, subtitle?: string }) {
    return (
            <Box marginVertical={'m'}>
                <Text
                        bold
                        variant={'body'}
                >{title}</Text>

                {
                        subtitle && (
                                <Box mt={'s'}>
                                    <Text
                                            color={'greyMain'}
                                            bold
                                            variant={'small'}
                                    >{subtitle}</Text>
                                </Box>
                        )
                }

            </Box>
    );
}