import { Modal, ModalHeader, ModalProps } from '@main-components/Base/Modal';
import { Box } from '@main-components/Base/Box';
import useFindProduct from '@modules/user/application/menu/use-find-product';
import ProductForm from '@modules/user/ui/screens/ProductsScreen/components/SaveProductModal/components/ProductForm';

interface SaveProductModalProps {
    modal: Partial<ModalProps>,
    form: {
        id?: string | undefined
        defaultValues?: any
    }
}

export default function SaveProductModal(props: SaveProductModalProps) {
    const { data: item, loading } = useFindProduct(props.form?.id ?? '', {
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
                    title={props?.form?.id ? 'Modificar producto' : 'Agregar producto'}
                    onClose={props.modal.onDismiss}
                    loading={loading}
                />
                <ProductForm
                    id={props.form.id}
                    defaultValues={props.form.defaultValues ?? item ? {
                        ...item?.toPrimitives(),
                        category: item?.categoryId
                    } : {
                        available: true
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