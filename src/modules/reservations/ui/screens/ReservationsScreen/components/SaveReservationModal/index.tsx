import { Modal, ModalHeader, ModalProps } from '@main-components/Base/Modal';
import { Box } from '@main-components/Base/Box';
import useGetReservation from '@modules/reservations/application/use-get-reservation';
import ReservationForm
    from '@modules/reservations/ui/screens/ReservationsScreen/components/SaveReservationModal/components/ReservationForm';

interface SaveReservationModalProps {
    modal: Partial<ModalProps>,
    form: {
        id?: string | undefined
        defaultValues?: any
    }
}

export default function SaveReservationModal(props: SaveReservationModalProps) {
    const { data: item, loading } = useGetReservation(props.form?.id ?? '', {
        enabled: !!props?.form?.id
    });

    return (
            <Modal
                    {...props.modal}
                    contentContainerStyle={{
                        maxWidth: 600
                    }}
            >

                <Box
                        flex={1}
                >
                    <ModalHeader
                            title={props?.form?.id ? 'Actualizar reservación' : 'Agregar reservación'}
                            onClose={props.modal.onDismiss}
                            loading={loading}
                    />
                    <ReservationForm
                            id={props.form.id}
                            defaultValues={props.form.defaultValues ? props.form.defaultValues : item ? {
                                ...item?.toPrimitives(),
                                clientId: item?.clientId,
                                mallId: item?.mallId,
                                tableId: `${item?.areaId}*${item?.tableId}`
                            } : {}}
                            item={item}
                            onSave={() => {
                                props?.modal.onDismiss?.();
                            }}
                    />
                </Box>
            </Modal>
    );
}