import { required } from '@shared/domain/form/validate';
import ImageCropperInput from '@main-components/Form/inputs/ImageCropperInput';

export function ProductImageInput(props) {
    const PREVIEW_IMAGE_SIZE = 250;
    const PREVIEW_IMAGE_HEIGHT = 250;
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
                width: 400,
                height: 400
            }}
            previewSize={{
                width: PREVIEW_IMAGE_SIZE,
                height: PREVIEW_IMAGE_HEIGHT
            }}
        />
    );
}
