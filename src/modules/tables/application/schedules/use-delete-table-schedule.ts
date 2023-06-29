import useNotify from '@modules/_shared/domain/hooks/use-notify';
import useDelete from '@modules/_shared/domain/hooks/resources/use-delete';
import TableSchedule from '@modules/tables/domain/models/table-schedule';
import TableScheduleRepository from '@modules/tables/domain/repositories/table-schedule-repository';


export function useDeleteTableSchedule() {
    const notify = useNotify();

    return useDelete<TableSchedule, TableScheduleRepository>({
        resource: 'table-schedules',
        repository: 'TableScheduleRepository',
        fn: (repo, ...rest) => repo.deleteSchedule(...rest),
        onSuccess: (response, queryClient) => {
            notify('Horario eliminado!', 'success');
        },
        onFailure: () => {
            notify('Error eliminando horario', 'error');
        }
    });
}