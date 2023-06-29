import { Box } from '@main-components/Base/Box';
import TouchableOpacity from '@main-components/Utilities/TouchableOpacity';
import React from 'react';
import { ImageViewerProps } from './ImageViewerProps';
import { useTheme } from '@shared/ui/theme/AppTheme';
import { ActivityIndicator } from '@main-components/Base/ActivityIndicator';
import { Icon } from '@main-components/Base/Icon';
import { IconButton } from '@main-components/Base/IconButton';
import { Image } from '@main-components/Base/Image';

export function ImageViewer(props: ImageViewerProps) {

    const {
        fullWidth = true,
        image,
        isDefaultImage,
        onChange,
        onRemove,
        canCrop,
        cropperOptions,
        loading
    } = props;

    const IMAGE_SIZE = props.imageProps ? props.imageProps : {
        width: 150,
        height: 150
    };

    const theme = useTheme();


    function ImageFrame({ children, ...rest }) {
        return (
            <Box
                style={{
                    overflow: 'hidden',
                    borderRadius: 20,
                    width: IMAGE_SIZE.width,
                    height: IMAGE_SIZE.height,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: theme.colors.primaryMain,
                    borderWidth: 2,
                    ...rest?.style ?? {}
                }}
            >
                {children}
            </Box>
        );
    }

    const FinalImageFrame = props.Frame ? props.Frame : ImageFrame;

    if (loading) {
        return (
            <FinalImageFrame
                previewSize={IMAGE_SIZE}
                style={{
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }}
            >
                <ActivityIndicator size={40} />
            </FinalImageFrame>

        );
    }

    if (isDefaultImage) {
        return (
            <TouchableOpacity
                style={{
                    width: IMAGE_SIZE.width,
                    height: IMAGE_SIZE.height
                }}
                onPress={onChange}
            >
                <Box
                    width={IMAGE_SIZE.width}
                    height={IMAGE_SIZE.height}
                    position={'relative'}
                    bg={'greyLightest'}
                    borderRadius={20}
                >
                    <FinalImageFrame previewSize={IMAGE_SIZE}>
                        <Box>
                            <Icon
                                name={'plus'}
                                numberSize={20}
                                color={'primaryMain'}
                            />
                        </Box>
                    </FinalImageFrame>
                </Box>
            </TouchableOpacity>
        );
    }

    return (
        <>
            <Box
                width={IMAGE_SIZE.width}
                height={IMAGE_SIZE.height}
                position={'relative'}
            >
                <FinalImageFrame previewSize={IMAGE_SIZE}>
                    <Image
                        source={{ uri: image }}
                        style={{ resizeMode: 'cover', width: IMAGE_SIZE.width, height: IMAGE_SIZE.height }}
                    />
                </FinalImageFrame>
                <Box
                    position={'absolute'}
                    bottom={-10}
                    right={-10}
                    zIndex={9999}
                >
                    <IconButton
                        borderRadius={30}
                        iconColor={'white'}
                        onPress={onChange}
                        iconName={'upload'}
                        backgroundColor={'primaryMain'}
                        iconSize={10}
                        iconType={'app'}
                    />
                </Box>
            </Box>

        </>
    );
}
