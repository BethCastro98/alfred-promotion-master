import useForgotPassword from '@modules/auth/application/use-forgot-password';
import React from 'react';
import SaveButton from '@main-components/Form/components/SaveButton';
import { required } from '@shared/domain/form/validate';
import { Box } from '@main-components/Base/Box';
import { Icon } from '@main-components/Base/Icon';
import useNavigation from '@shared/domain/hooks/navigation/use-navigation';
import { Form } from '@main-components/Form/Form';
import Text from '@main-components/Typography/Text';
import AppIcon from '@main-components/Base/AppIcon';
import TouchableOpacity from '@main-components/Utilities/TouchableOpacity';
import EmailTextInput from '@main-components/Form/inputs/EmailTextInput';

export default function ForgotPassword() {
    return (

            <Box
                    bg={'white'}
                    flex={1}
                    justifyContent={'center'}
            >
                <Box
                        flex={0}
                        bg='greyLight'
                        width={'100%'}
                        borderRadius={20}
                        maxWidth={600}
                        style={{
                            minHeight: 'fit-content'
                        }}
                        p={'m'}
                        margin={'m'}
                        alignSelf={'center'}
                        justifyContent={'center'}
                >
                    <Form
                            defaultValues={{
                                currentState: 'initial'
                            }}
                            toolbar={<FormToolbar />}
                            onSubmit={() => {
                            }}
                    >
                        <AuthScreenTitle
                                icon={
                                    <AppIcon
                                            name={'envelope'}
                                            size={40}
                                            color={'primaryMain'}
                                    />
                                }
                                title={
                                    'Ingrese su correo electrónico para continuar'
                                }
                        />

                        <EmailTextInput
                                source='email'
                                placeholder='Escribe tu correo electrónico'
                                mode='rounded'
                                bg={'white'}
                                validate={required()}
                                filterText={(text) => {
                                    return text?.replace(/ /g, '');
                                }}
                        />
                        <Box
                                mb='xl'
                                mt='xs'
                                paddingHorizontal='l'
                        >
                            <Box
                                    flexDirection='row'
                                    justifyContent='center'
                                    alignItems='center'
                            >
                                <Box
                                        width={35}
                                        mr='m'
                                >
                                    <AppIcon
                                            name={'email-bubble'}
                                            size={25}
                                            color={'primaryMain'}
                                    />
                                </Box>
                                <Box flex={1}>
                                    <Text
                                            color='greyMain'
                                            variant='body'
                                    >
                                        Te enviaremos un link para cambiar tu
                                        contraseña
                                    </Text>
                                </Box>
                            </Box>
                        </Box>
                    </Form>
                </Box>
            </Box>

    );
}

function AuthScreenTitle({ title, icon }) {
    return (
            <Box
                    marginHorizontal={'m'}
                    mb={'m'}
            >
                <Box
                        justifyContent='center'
                        alignItems='center'
                        mb='s'
                >
                    {icon}
                </Box>
                <Box
                        paddingHorizontal='m'
                        mb='s'
                >
                    <Text
                            align='center'
                            bold
                    >
                        {title}
                    </Text>
                </Box>
            </Box>
    );
}

function BackButton() {
    const { goBack, canGoBack } = useNavigation();

    return (
            <Box
                    position='absolute'
                    left={30}
                    zIndex={9999}
            >
                <TouchableOpacity
                        onPress={() => {
                            goBack();
                        }}
                        style={{
                            borderRadius: 30 / 2,
                            width: 30,
                            height: 30,
                            backgroundColor: 'white',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                >
                    <Icon
                            name='chevron-left'
                            numberSize={20}
                            color='primaryMain'
                    />
                </TouchableOpacity>
            </Box>
    );
}

function FormToolbar(props: any) {
    const { forgotPassword, loading } = useForgotPassword();

    return (
            <Box alignItems={'center'}>
                <SaveButton
                        {...props}
                        label='Enviar link'
                        titleColor={'white'}
                        loading={loading}
                        backgroundColor={'primaryMain'}
                        uppercase={false}
                        icon={() => {
                            return <AppIcon
                                    name='send'
                                    size={20}
                                    color='white'
                            />;
                        }}
                        onSubmit={(data) => {
                            forgotPassword(data.email);
                        }}
                />
            </Box>
    );
}
