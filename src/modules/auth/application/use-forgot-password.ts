import useNotify from '@shared/domain/hooks/use-notify';
import useRepository from '@shared/domain/hooks/use-repository';
import { useState } from 'react';
import AuthUserRepository from '../domain/repositories/auth-user-repository';

export default function useForgotPassword() {
    const userRepo = useRepository<AuthUserRepository>('AuthUserRepository');
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(true);
    const notify = useNotify();

    return {
        forgotPassword: async (userEmail: any) => {
            setLoaded(false);
            setLoading(true);
            try {
                setLoaded(true);

                await userRepo.resetPassword(userEmail);

                setLoading(false);

                notify(
                    'Te hemos enviado un correo con las instrucciones para recuperar tu contraseña',
                    'success',
                );
            } catch (error) {
                setLoading(false);

                if (error.message == 'EMAIL_NOT_SEND') {
                    notify(
                        'No fue posible enviar el correo, por favor inténtalo nuevamente',
                        'warning',
                    );
                    return;
                }

                if (error.message == 'CREDENTIALS_NOT_FOUND') {
                    notify('Este usuario no está registrado', 'warning');
                    return;
                }

                notify(
                    'No fue posible procesar tu solicitud. Inténtalo nuevamente',
                    'error',
                );
            }
        },
        loading,
        loaded,
    };
}
