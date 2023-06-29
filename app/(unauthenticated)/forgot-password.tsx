import React from 'react';
import ForgotPassword from '@modules/auth/ui/screens/ForgotPassword';
import AppStack from '@main-components/Base/AppStack';

export default function ForgotPasswordRoute() {
    return (
            <>
                <AppStack.Screen
                        options={{
                            title: 'Olvidé mi clave'
                        }}
                />
                <ForgotPassword />
            </>
    );
}