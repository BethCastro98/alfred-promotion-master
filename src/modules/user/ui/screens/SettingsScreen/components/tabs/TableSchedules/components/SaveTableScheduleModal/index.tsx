import { Modal, ModalHeader, ModalProps } from '@main-components/Base/Modal';
import { Box } from '@main-components/Base/Box';
import useGetTableSchedule from '@modules/tables/application/schedules/use-get-table-schedule';
import TableScheduleForm
    from '@modules/user/ui/screens/SettingsScreen/components/tabs/TableSchedules/components/SaveTableScheduleModal/components/TableScheduleForm';
import useGetIdentity from '@modules/auth/application/use-get-identity';

interface SaveTableScheduleModalProps {
    modal: Partial<ModalProps>,
    form: {
        id?: string | undefined
        defaultValues?: any
    }
}

export default function SaveTableScheduleModal(props: SaveTableScheduleModalProps) {
    const { identity, loading: loadingIdentity } = useGetIdentity();
    const { data: item, loading } = useGetTableSchedule(props.form?.id ?? '', {
        enabled: !!props?.form?.id
    });

    const isLoading = loadingIdentity || loading;

    return (
            <Modal
                    {...props.modal}
                    contentContainerStyle={{
                        maxWidth: 650
                    }}
            >

                <Box
                        flex={1}
                >
                    <ModalHeader
                            title={props?.form?.id ? 'Modificar horario' : 'Agregar horario'}
                            onClose={props.modal.onDismiss}
                            loading={isLoading}
                    />
                    <TableScheduleForm
                            id={props.form.id}
                            defaultValues={props.form.defaultValues ?? {
                                ...item ? item.toPrimitives() : {}
                            }}
                            onSave={() => {
                                props?.modal.onDismiss?.();
                            }}
                            item={item}
                            user={identity}
                    />
                </Box>
            </Modal>
    );
}