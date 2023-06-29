import useNotify from '@shared/domain/hooks/use-notify';
import useCreate from '@shared/domain/hooks/resources/use-create';
import TableSchedule from '@modules/tables/domain/models/table-schedule';
import TableScheduleRepository from '@modules/tables/domain/repositories/table-schedule-repository';

export default function useCreateTableSchedule() {
    const notify = useNotify();

    return useCreate<TableScheduleRepository, TableSchedule>({
        resource: 'table-schedules',
        repository: 'TableScheduleRepository',
        fn: (repo, ...rest) => repo.createSchedule(rest[0]),
        onSuccess: (response, queryClient, params) => {
        },
        onFailure: () => {
            notify('Error en crear horario', 'error');
        }
    });
}
