import { required } from '@shared/domain/form/validate';
import ImageCropperInput from '@main-components/Form/inputs/ImageCropperInput';
import {
    ImageViewerProps
} from '@main-components/Form/inputs/ImageInput/components/BaseImageInput/components/ImageViewer/ImageViewerProps';
import { useTheme } from '@shared/ui/theme/AppTheme';
import { Box } from '@main-components/Base/Box';
import { ActivityIndicator } from '@main-components/Base/ActivityIndicator';
import TouchableOpacity from '@main-components/Utilities/TouchableOpacity';
import { Icon } from '@main-components/Base/Icon';
import { Image } from '@main-components/Base/Image';
import { IconButton } from '@main-components/Base/IconButton';

export function ClientImageInput(props) {
    const PREVIEW_IMAGE_SIZE = 200;
    const PREVIEW_IMAGE_HEIGHT = 200;
    return (
            <ImageCropperInput
                    {...props}
                    source={'imageUrl'}
                    validate={[required()]}
                    required
                    cropSize={{
                        width: 200,
                        height: 200
                    }}
                    previewSize={{
                        width: PREVIEW_IMAGE_SIZE,
                        height: PREVIEW_IMAGE_HEIGHT
                    }}
                    ImageViewer={(props) => {
                        return <LogoViewer {...props} />;
                    }}
            />
    );
}


function LogoViewer({
    isDefaultImage,
    onChange,
    image,
    loading
}: ImageViewerProps) {

    const IMAGE_SIZE = 150;
    const theme = useTheme();

    if (loading) {
        return (
                <Box
                        style={{
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            overflow: 'hidden',
                            borderRadius: IMAGE_SIZE / 2,
                            width: IMAGE_SIZE,
                            height: IMAGE_SIZE,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                >
                    <ActivityIndicator size={40} />
                </Box>
        );
    }

    function ImageFrame({ children }) {
        return (
                <Box
                        style={{
                            overflow: 'hidden',
                            borderRadius: IMAGE_SIZE / 2,
                            width: IMAGE_SIZE,
                            height: IMAGE_SIZE,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderColor: theme.colors.primaryMain,
                            borderWidth: 2
                        }}
                >
                    {children}
                </Box>
        );
    }

    if (isDefaultImage) {
        return (
                <TouchableOpacity
                        style={{
                            width: IMAGE_SIZE,
                            height: IMAGE_SIZE
                        }}
                        onPress={onChange}
                >
                    <Box
                            width={IMAGE_SIZE}
                            height={IMAGE_SIZE}
                            position={'relative'}
                            bg={'greyLightest'}
                            borderRadius={IMAGE_SIZE / 2}
                    >
                        <ImageFrame>
                            <Box>
                                <Icon
                                        name={'plus'}
                                        numberSize={20}
                                        color={'primaryMain'}
                                />
                            </Box>
                        </ImageFrame>
                    </Box>
                </TouchableOpacity>
        );
    }

    return (
            <Box
                    width={IMAGE_SIZE}
                    height={IMAGE_SIZE}
                    position={'relative'}
            >
                <ImageFrame>
                    <Image
                            source={{ uri: image }}
                            style={{ resizeMode: 'cover', width: IMAGE_SIZE, height: IMAGE_SIZE }}
                    />
                </ImageFrame>
                <Box
                        position={'absolute'}
                        bottom={5}
                        right={5}
                        zIndex={9999}
                >
                    <IconButton
                            borderRadius={30}
                            iconColor={'white'}
                            onPress={onChange}
                            iconName={'upload'}
                            backgroundColor={'greyMain'}
                            iconSize={20}
                            containerSize={40}
                            iconType={'app'}
                    />
                </Box>
            </Box>
    );
}