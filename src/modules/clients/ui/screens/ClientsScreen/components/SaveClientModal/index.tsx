import { Modal, ModalHeader, ModalProps } from '@main-components/Base/Modal';
import { Box } from '@main-components/Base/Box';
import useGetClient from '@modules/clients/application/use-get-client';
import ClientForm from '@modules/clients/ui/screens/ClientsScreen/components/SaveClientModal/components/ClientForm';

interface SaveClientModalProps {
    modal: Partial<ModalProps>,
    form: {
        id?: string | undefined
        defaultValues?: any
    }
}

export default function SaveClientModal(props: SaveClientModalProps) {
    const { data: item, loading } = useGetClient(props.form?.id ?? '', {
        enabled: !!props?.form?.id
    });

    return (
            <Modal
                    {...props.modal}
                    contentContainerStyle={{
                        maxWidth: 500
                    }}
            >

                <Box
                        flex={1}
                >
                    <ModalHeader
                            title={props?.form?.id ? 'Modificar cliente' : 'Agregar cliente'}
                            onClose={props.modal.onDismiss}
                            loading={loading}
                    />
                    <ClientForm
                            id={props.form.id}
                            defaultValues={props.form.defaultValues ?? item ? {
                                ...item?.toPrimitives()
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