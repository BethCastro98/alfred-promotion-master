import { checkInputSource } from '@main-components/Form/Form';
import useInput from '@shared/domain/form/useInput';
import useFormFieldErrors from '@shared/domain/form/use-form-field-errors';
import React, { useState } from 'react';
import { Box } from '@main-components/Base/Box';
import { BaseInput } from '@main-components/Form/inputs/BaseInput';
import { ImageViewer } from '@main-components/Form/inputs/ImageInput/components/BaseImageInput/components/ImageViewer';
import { useTheme } from '@shared/ui/theme/AppTheme';
import { useUtils } from '@shared/domain/hooks/use-utils';
import { Platform } from 'react-native';
import {
    useImageChooserOptions
} from '@main-components/Form/inputs/ImageInput/components/BaseImageInput/components/ImageChooser/ImageChooser';
import { manipulateAsync } from 'expo-image-manipulator';
import ImageCropperModal
    from '@main-components/Form/inputs/ImageInput/components/BaseImageInput/components/ImageCropper/components/ImageCropperModal';


export default function ImageCropperInput({ source, label, validate, cropSize, previewSize, aspect = 1, ...rest }) {
    checkInputSource({ source });

    const { input } = useInput({
        validate: validate,
        source: source as string
    });

    const { hasError, error } = useFormFieldErrors(source as string);
    const isLoading = false;
    const InputImageViewer = rest.ImageViewer ?? ImageViewer;

    const isDefaultImage = !input.value;
    const imageToShow = input.value?.image ?? input.value ?? {
        uri: rest.defaultImage
    };

    const { pickImage, handleImageSelected, resize, crop } = useImageCropperPicker();

    const [isCropped, setIsCropped] = useState(false);
    const [openCropModal, setOpenCropModal] = useState(false);

    const cropperOptions = {
        onCrop: (c) => {
            applyCrop(c);
        },
        ...cropSize,
        onCancel: () => {
            input.onChange(undefined);
        }
    };

    const toggleImageChooser = async () => {
        await pickImage(async (data) => {
            const rs = await handleImageSelected(data);
            const format = rs.fileName.split('.')?.[1];

            const finalResult = await handleImageSelected({
                image: rs.image,
                base64: rs.base64
            });

            input.onChange({
                id: finalResult.id,
                fileName: finalResult.fileName,
                blob: finalResult.blob,
                image: finalResult.image,
                base64: finalResult.base64,
                format,
                isCropped: false
            });
        });
    };

    const applyCrop = async (cropState: any) => {
        if (!cropState) return;
        if (cropState.width === 0 || cropState.height === 0) return;
        if (!cropState.scale) return;
        const scaleX = cropState.scale.x;
        const scaleY = cropState.scale.y;
        const pixelRatio = 1;
        try {
            const cropResult = await crop({
                uri: input.value.image,
                dimensions: {
                    width: Math.floor(cropState.width * scaleX * pixelRatio),
                    height: Math.floor(cropState.height * scaleY * pixelRatio),
                    x: cropState.x * scaleX,
                    y: cropState.y * scaleY
                },
                format: input.value.format
            });

            const resizeResult = await resize({
                uri: cropResult.uri,
                dimensions: {
                    width: cropState.width,
                    height: cropState.height

                },
                format: input.value.format
            });

            const finalResult = await handleImageSelected({
                image: resizeResult.uri,
                base64: resizeResult.base64
            });

            setIsCropped(true);
            input.onChange({
                id: finalResult.id,
                fileName: finalResult.fileName,
                blob: finalResult.blob,
                image: finalResult.image,
                base64: finalResult.base64,
                isCropped: true
            });
        } catch (e) {
            console.log(e);
        }

    };
    const onRemoveImage = () => {
        input.onChange(null);
    };

    const onBrowsePress = async () => {
        await toggleImageChooser();
        if (cropperOptions) {
            setOpenCropModal(true);
        }
    };

    const onCancel = () => {
        setOpenCropModal(false);
        setTimeout(() => {
            cropperOptions?.onCancel?.();
        }, 100);
    };


    return (
        <BaseInput
            error={hasError ? error : undefined}
            label={label}
            helperText={rest.helperText}
            noMargin={rest.noMargin}
            WrapperComponent={Box}
            required={rest.required}
        >
            <Box
                justifyContent={'center'}
            >
                <InputImageViewer
                    loading={isLoading}
                    isDefaultImage={isDefaultImage}
                    image={imageToShow}
                    onChange={onBrowsePress}
                    onRemove={onRemoveImage}
                    fullWidth={true}
                    imageProps={{
                        ...previewSize,
                        resizeMode: 'contain'
                    }}
                    canCrop={!isCropped && !!input.value?.image}
                />

                <ImageCropperModal
                    modal={{
                        visible: openCropModal,
                        onDismiss: onCancel,
                        dismissable: true
                    }}
                    cropperOptions={{
                        ...cropperOptions,
                        onCrop: (params, setError) => {
                            setError(source, {
                                message: undefined
                            });
                            cropperOptions?.onCrop?.(params);
                            setOpenCropModal(false);
                        },
                        aspect: aspect
                    }}
                    cropSize={cropSize}
                    image={imageToShow}
                    onError={(setError) => {
                        setError(source, {
                            message: `Imagen no cumple con las especificaciones: ${rest.helperText}`
                        });

                        setTimeout(() => {
                            onCancel();
                        }, 100);
                    }}
                />
            </Box>
        </BaseInput>
    );
}

function useImageCropperPicker() {
    const theme = useTheme();
    const { uuid } = useUtils();

    const { pickImage, loading } = useImageChooserOptions();

    async function handleImageSelected({ image: selectedImage, base64 }: any) {
        const getExtension = (url: string) => {
            if (Platform.OS == 'web') {
                return url.split('/')[1].split(';').shift();
            }

            return url.split('/').pop();
        };

        const rs = await fetch(selectedImage)
        .then((res) => res.blob())
        .then((blob) => {
            const ext = getExtension(selectedImage);
            const fileName = uuid.generate() + '.' + ext;

            return {
                blob: blob,
                image: selectedImage,
                base64: base64,
                fileName,
                id: uuid.generate()
            };
        });

        return rs;
    }

    async function resize({
        uri,
        dimensions: { width, height },
        format
    }: { uri: any, dimensions: { width?: any; height?: any }, format: string }) {
        const result = await manipulateAsync(uri, [
            {
                resize: {
                    width: width !== '' ? width : undefined,
                    height: height !== '' ? height : undefined
                }
            }
        ], {
            format: format == 'png' ? 'png' : 'jpeg' as any
        });
        return result;
    }


    async function crop({
        uri,
        dimensions: { width, height, x, y },
        format
    }: { uri: any, dimensions: { width?: any; height?: any, x: number, y: number }, format: string }) {
        const result = await manipulateAsync(uri, [
            {
                crop: {
                    width: width !== '' ? width : undefined,
                    height: height !== '' ? height : undefined,
                    originX: x,
                    originY: y
                }
            }
        ], {
            format: format == 'png' ? 'png' : 'jpeg' as any
        });
        return result;
    }

    return {
        loading,
        pickImage,
        resize,
        crop,
        handleImageSelected
    };
}
