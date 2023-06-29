import { Modal, ModalHeader, ModalProps } from '@main-components/Base/Modal';
import React, { useState } from 'react';
import { Box } from '@main-components/Base/Box';
import {
    ImageCropper
} from '@main-components/Form/inputs/ImageInput/components/BaseImageInput/components/ImageCropper/ImageCropper';
import { useForm } from '@shared/domain/form/useForm';

interface ImageCropperModalProps {
    modal: Partial<ModalProps>,
    cropperOptions: any
    cropSize?: any
    image: any
    onError?: any
}

export default function ImageCropperModal(props: ImageCropperModalProps) {
    const [scale, setScale] = useState({ x: 0, y: 0 });
    const [renderedSize, setRenderedSize] = useState({ width: 0, height: 0 });

    const { setError } = useForm();
    return (
        <Modal
            {...props.modal}
            contentContainerStyle={{
                maxWidth: 500
            }}
        >
            <Box mb={'m'}>
                <ModalHeader
                    title={undefined}
                    onClose={props.modal.onDismiss}
                    loading={false}
                />
            </Box>

            <Box
                minHeight={500}
            >
                <ImageCropper
                    {
                        ...props.cropperOptions
                    }
                    onCrop={(params) => {
                        props.cropperOptions?.onCrop(params, setError);
                    }}
                    scale={scale}
                    renderedSize={renderedSize}
                >
                    <img
                        src={props.image}
                        style={{ transform: `scale(${1}) rotate(${0}deg)`/*, width: '100%' */ }}
                        onLoad={(e) => {
                            const { width, height, naturalWidth, naturalHeight } = e.currentTarget;

                            if (props.cropSize && (props.cropSize.width > naturalWidth || props.cropSize.height > naturalHeight)) {
                                props.onError?.(setError);
                                return;
                            }
                            setScale({
                                x: naturalWidth / width,
                                y: naturalHeight / height
                            });
                            setRenderedSize({
                                width,
                                height
                            });
                        }}
                    />
                </ImageCropper>
            </Box>
        </Modal>
    );
}