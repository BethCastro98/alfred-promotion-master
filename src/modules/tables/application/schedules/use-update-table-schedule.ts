import useUpdate from '@shared/domain/hooks/resources/use-update';
import useNotify from '@shared/domain/hooks/use-notify';
import TableScheduleRepository from '@modules/tables/domain/repositories/table-schedule-repository';
import TableSchedule from '@modules/tables/domain/models/table-schedule';

export default function useUpdateTableSchedule() {
    const notify = useNotify();

    return useUpdate<TableSchedule, TableScheduleRepository>({
        resource: 'table-schedules',
        repository: 'TableScheduleRepository',
        fn: (repo, ...rest) => repo.updateSchedule(rest[1]),
        onSuccess: (response, queryClient, params) => {
        },
        onFailure: () => {
            notify('Error en actualizar', 'error');
        }
    });
}
