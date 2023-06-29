import QueryOptions from '@shared/domain/models/query-options';
import useFindTableSchedules from '@modules/tables/application/schedules/use-find-table-schedules';

export default function useGetTableSchedule(id: string, options?: QueryOptions) {
    const { data, loading } = useFindTableSchedules({}, undefined, undefined, options);
    return {
        data: (data ?? {})[id],
        loading
    };
}