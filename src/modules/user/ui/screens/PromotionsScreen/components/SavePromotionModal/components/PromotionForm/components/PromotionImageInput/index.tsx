import { required } from '@shared/domain/form/validate';
import ImageCropperInput from '@main-components/Form/inputs/ImageCropperInput';

export function PromotionImageInput(props) {
    const PREVIEW_IMAGE_SIZE = 380;
    const PREVIEW_IMAGE_HEIGHT = PREVIEW_IMAGE_SIZE / 2;
    return (
        <ImageCropperInput
            {...props}
            source={'imageUrl'}
            validate={[required() /*(value) => {
                if (value && !value.isCropped) {
                    return 'Por favor aplica el recorte de la imagen';
                }
                return;
            }*/]}
            required
            cropSize={{
                width: 800,
                height: 800 / 2
            }}
            previewSize={{
                width: PREVIEW_IMAGE_SIZE,
                height: PREVIEW_IMAGE_HEIGHT
            }}
            aspect={2 / 1}
        />
    );
}
