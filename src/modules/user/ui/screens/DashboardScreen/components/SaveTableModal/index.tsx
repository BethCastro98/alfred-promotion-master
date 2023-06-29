import { Box } from '@main-components/Base/Box';
import { Modal, ModalHeader, ModalProps } from '@main-components/Base/Modal';
import TableForm from './components/TableForm';
import useFindRestaurantAreas from '@modules/tables/application/use-find-restaurant-areas';

interface SaveTableModalProps {
    modal: Partial<ModalProps>,
    form: {
        id?: string
        areaId?: string;
        defaultValues?: any
    }
}

export default function SaveTableModal(props: SaveTableModalProps) {

    const { data: areas, loading } = useFindRestaurantAreas({});

    const area = !!props.form?.id && !!props.form?.areaId ? areas?.[props.form?.areaId] : undefined;
    const table = props.form?.id ? area?.findTable(props.form?.id) : undefined;

    const item = {
        id: props.form.id,
        areaId: props.form.areaId
    };

    return (
            <Modal
                    {...props.modal}
                    contentContainerStyle={{
                        maxWidth: 600
                    }}
            >
                <Box>
                    <ModalHeader
                            title={props.form.id ? `${area?.name ?? ''} - Mesa ${table?.number ?? ''}` : 'Agregar Mesa'}
                            onClose={props.modal.onDismiss}
                            loading={loading}
                    />
                    <TableForm
                            item={item}
                            table={table}
                            areas={Object.values(areas ?? [])}
                            defaultValues={props.form.defaultValues}
                            onSave={() => {
                                props.modal?.onDismiss?.();
                            }}
                    />
                </Box>
            </Modal>
    );
}