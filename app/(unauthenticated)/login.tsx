import React from 'react';
import EmailLogin from '@modules/auth/ui/screens/EmailLogin';
import AppStack from '@main-components/Base/AppStack';

export default function LoginRoute() {
    return (
            <>
                <AppStack.Screen
                        options={{
                            title: "Iniciar sesión"
                        }}
                />
                <EmailLogin />
            </>
    );
}