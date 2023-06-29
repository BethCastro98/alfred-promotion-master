import { Modal, ModalHeader, ModalProps } from '@main-components/Base/Modal';
import { Box } from '@main-components/Base/Box';
import useFindPromotion from '@modules/user/application/promotions/use-find-promotion';
import PromotionForm
    from '@modules/user/ui/screens/PromotionsScreen/components/SavePromotionModal/components/PromotionForm';

interface SavePromotionModalProps {
    modal: Partial<ModalProps>,
    form: {
        id?: string | undefined
        defaultValues?: any
    }
}

export default function SavePromotionModal(props: SavePromotionModalProps) {
    const { data: item, loading } = useFindPromotion(props.form?.id ?? '', {
        enabled: !!props?.form?.id
    });


    return (
            <Modal
                    {...props.modal}
                    contentContainerStyle={{
                        maxWidth: 800

                    }}
            >

                <Box
                        flex={1}
                >
                    <ModalHeader
                            title={props?.form?.id ? 'Modificar promoción' : 'Agregar promoción'}
                            onClose={props.modal.onDismiss}
                            loading={loading}
                    />
                    <PromotionForm
                            id={props.form.id}
                            defaultValues={props.form.defaultValues ?? {
                                ...item?.toPrimitives() ?? {
                                    available: true
                                }
                            }}
                            item={item}
                            onSave={() => {
                                props?.modal.onDismiss?.();
                            }}
                    />
                </Box>
            </Modal>
    );
}