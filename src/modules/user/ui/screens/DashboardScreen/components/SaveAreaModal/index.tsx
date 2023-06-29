import { Modal, ModalHeader, ModalProps } from '@main-components/Base/Modal';
import { Box } from '@main-components/Base/Box';
import AreaForm from '@modules/user/ui/screens/DashboardScreen/components/SaveAreaModal/components/AreaForm';
import useGetIdentity from '@modules/auth/application/use-get-identity';
import useGetRestaurantArea from '@modules/tables/application/use-get-restaurant-area';

interface SaveAreaModalProps {
    modal: Partial<ModalProps>,
    form: {
        id?: string
        defaultValues?: any
    }
}

export default function SaveAreaModal(props: SaveAreaModalProps) {
    const { identity, loading: loadingIdentity } = useGetIdentity();
    const { data: area, loading: loadingArea } = useGetRestaurantArea(props.form?.id ?? '', {
        enabled: !!props.form?.id
    });

    const isLoading = loadingIdentity || loadingArea;

    return (
            <Modal
                    {...props.modal}
                    contentContainerStyle={{
                        maxWidth: 400
                    }}
            >
                <Box>
                    <ModalHeader
                            title={props.form.id ? 'Actualizar Sección' : 'Agregar Sección'}
                            onClose={props.modal.onDismiss}
                            loading={isLoading}
                    />
                    <AreaForm
                            user={identity}
                            id={props.form.id}
                            area={area}
                            defaultValues={props.form.defaultValues}
                            onSave={() => {
                                props.modal?.onDismiss?.();
                            }}
                    />
                </Box>
            </Modal>
    );
}