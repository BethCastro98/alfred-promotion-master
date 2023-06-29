import React from 'react';
import useNavigation from '@shared/domain/hooks/navigation/use-navigation';
import Text from '@main-components/Typography/Text';
import AppIcon from '@main-components/Base/AppIcon';
import useParams from '@shared/domain/hooks/navigation/use-params';
import images from '@shared/ui/images/images';
import { Image } from '@main-components/Base/Image';
import { Box } from '@main-components/Base/Box';
import { Button } from '@main-components/Base/Button';

export default function NotFound({
    title = 'Recurso no encontrado',
    description = ''
}: {
    title?: string;
    description?: string;
}) {
    const params = useParams();
    const { navigate, reset } = useNavigation();

    return (
            <Box
                    padding='s'
                    bg='primaryDark'
                    flex={1}
                    justifyContent='center'
                    alignItems='center'
            >
                <>
                    <Box mb='s'>
                        <AppIcon
                                color='white'
                                size={80}
                                name='info-circle'
                        />
                    </Box>
                    <Image
                            resizeMode='contain'
                            showPlaceHolder={false}
                            style={{ maxWidth: '70%' }}
                            source={images.LOGO}
                    />
                    <Box
                            mb='s'
                            mt='s'
                    >
                        <Text
                                bold
                                variant='heading2'
                                color='white'
                        >
                            {params?.title || title}
                        </Text>
                    </Box>
                    <Box
                            mb='s'
                            mt='s'
                    >
                        <Text
                                align='center'
                                variant='heading3'
                                color='white'
                        >
                            {params?.description || description}
                        </Text>
                    </Box>
                    <Box
                            mb='s'
                            mt='s'
                    >
                        <Button
                                title='Ir al inicio'
                                onPress={async () => {
                                    reset({
                                        routes: [
                                            {
                                                name: '(home)/'
                                            }
                                        ]
                                    });
                                }}
                        />
                    </Box>
                </>
            </Box>
    );
}
