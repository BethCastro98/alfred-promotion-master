import { Modal, ModalHeader, ModalProps } from '@main-components/Base/Modal';
import { Box } from '@main-components/Base/Box';
import UserForm from '@modules/user/ui/screens/UsersScreen/components/SaveUserModal/components/UserForm';
import useFindUser from '@modules/user/application/accounts/use-find-user';

interface SaveRestaurantModalProps {
    modal: Partial<ModalProps>,
    form: {
        id?: string
        defaultValues?: any
    }
}

export default function SaveUserModal(props: SaveRestaurantModalProps) {
    const { data: user, refetch, loading } = useFindUser(props.form?.id ?? '', {
        enabled: !!props.form?.id
    });

    return (
            <Modal
                    {...props.modal}
                    contentContainerStyle={{
                        maxWidth: 600
                    }}
            >
                <Box>
                    <ModalHeader
                            title={props.form.id ? 'Actualizar usuario' : 'Agregar usuario'}
                            onClose={props.modal.onDismiss}
                            loading={loading}
                    />
                    <UserForm
                            id={props.form.id}
                            user={props.form.id ? user : undefined}
                            defaultValues={props.form.defaultValues}
                            onSave={() => {
                                props.modal?.onDismiss?.();
                            }}
                    />
                </Box>
            </Modal>
    );
}