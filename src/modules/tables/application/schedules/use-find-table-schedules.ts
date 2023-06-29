import PaginationOptions from '@shared/domain/models/pagination-options';
import SortOptions from '@shared/domain/models/sort-options';
import QueryOptions from '@shared/domain/models/query-options';
import useGetList from '@shared/domain/hooks/resources/use-get-list';
import TableSchedule from '@modules/tables/domain/models/table-schedule';
import TableScheduleRepository from '@modules/tables/domain/repositories/table-schedule-repository';

export default function useFindTableSchedules(
    filter?: any,
    pagination?: PaginationOptions,
    sort?: SortOptions,
    options?: QueryOptions
) {
    return useGetList<TableSchedule, TableScheduleRepository>({
        resource: 'table-schedules',
        repository: 'TableScheduleRepository',
        filters: filter,
        fn: (repo, ...rest) => repo.findSchedules(...rest),
        pagination,
        sort,
        options
    });
}
