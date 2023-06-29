import SaveButton from '@main-components/Form/components/SaveButton';
import useLoginWithEmailAndPassword from '@modules/auth/application/use-login-with-email-and-password';
import { email, required } from '@shared/domain/form/validate';
import React from 'react';
import { useTheme } from '@shared/ui/theme/AppTheme';
import useNavigation from '@shared/domain/hooks/navigation/use-navigation';
import { Form } from '@main-components/Form/Form';
import PasswordInput from '@main-components/Form/inputs/PasswordInput';
import Text from '@main-components/Typography/Text';
import { Box } from '@main-components/Base/Box';
import { Icon } from '@main-components/Base/Icon';
import EmailTextInput from '@main-components/Form/inputs/EmailTextInput';

export default function EmailLogin() {
    const { navigate } = useNavigation();
    const theme = useTheme();

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
                        paddingVertical={'xl'}
                        maxWidth={400}
                        style={{
                            minHeight: 'fit-content',
                            backgroundImage: `linear-gradient(${theme.colors.contrastMain},${theme.colors.contrastLight}) `
                        }}
                        p={'m'}
                        margin={'m'}
                        alignSelf={'center'}
                        justifyContent={'center'}
                >
                    <AuthScreenTitle
                            icon={
                                <Icon
                                        name={'lock'}
                                        numberSize={50}
                                        color={'primaryMain'}
                                />
                            }
                            title={'Inicia sesión'}
                    />

                    <Form
                            defaultValues={{}}
                            style={{
                                marginHorizontal: theme.spacing.m
                            }}
                            toolbar={<LoginButtonContainer />}
                            onSubmit={() => {
                            }}
                    >
                        <EmailTextInput
                                source='email'
                                errorColor={'white'}
                                mode='rounded'
                                label='Correo electrónico'
                                placeholder='Ej. myemail@domain.com'
                                bg={'white'}
                                validate={[
                                    required('Escribe tu correo electrónico'),
                                    email('Correo inválido')
                                ]}
                                filterText={(text) => {
                                    return text?.replace(/ /g, '');
                                }}
                                autoFocus={true}
                        />

                        <PasswordInput
                                source='password'
                                errorColor={'white'}
                                bg={'white'}
                                placeholder='Escribe tu contraseña'
                                validate={required()}
                                mode='rounded'
                                label='Contraseña'
                        />

                        {/*<Box
                                mb='s'
                                mt='s'
                                alignItems={'center'}
                        >
                            <Button
                                    mode='text'
                                    uppercase={false}
                                    titleColor='primaryMain'
                                    onPress={() => {
                                        navigate('forgot-password');
                                    }}
                                    title='¿Olvidaste tu contraseña?'
                            />
                        </Box>*/}
                    </Form>
                </Box>
            </Box>
    );
}

function LoginButtonContainer(props: any) {
    const { login, loading } = useLoginWithEmailAndPassword();

    const submitLoginForm = async (values: {
        email: string;
        password: string;
    }) => {
        try {
            await login({ email: values.email, password: values.password });
        } catch (error) {
            throw new Error(error);
        }
    };

    return (
            <Box
                    alignItems={'center'}
                    marginHorizontal={'m'}
            >
                <SaveButton
                        {...props}
                        label='Ingresar'
                        titleColor={'white'}
                        loading={loading}
                        backgroundColor={'primaryMain'}
                        uppercase={false}
                        onSubmit={async (data) => {
                            await submitLoginForm(data);
                        }}
                />
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
