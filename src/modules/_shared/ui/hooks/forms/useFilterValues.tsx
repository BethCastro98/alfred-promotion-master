import { useUtils } from '@modules/_shared/domain/hooks/use-utils';

export function useFilterValues(typesMap: { [filterId: string]: 'string' | 'array' | 'number' | 'range' }) {
    const { array } = useUtils();

    return {
        toFilters(formValues) {

            const values = Object.keys(formValues).reduce((currentFilter, id) => {
                let filterValue = {};

                if (formValues[id] == '' || formValues[id].length == 0) {
                    filterValue = {
                        [id]: undefined
                    };
                    return {
                        ...currentFilter,
                        ...filterValue
                    };
                }

                if (typesMap[id] === 'number') {
                    filterValue = {
                        [id]: parseInt(formValues[id])
                    };

                    return {
                        ...currentFilter,
                        ...filterValue
                    };
                }

                if (typesMap[id] === 'array') {
                    if (formValues[id] == '' || formValues[id].length == 0) {
                        filterValue = {
                            [id]: undefined
                        };

                        return {
                            ...currentFilter,
                            ...filterValue
                        };
                    }

                    filterValue = {
                        [id]: {
                            inq: formValues[id]
                        }
                    };

                    return {
                        ...currentFilter,
                        ...filterValue
                    };
                }

                filterValue = {
                    [id]: formValues[id]
                };

                return {
                    ...currentFilter,
                    ...filterValue
                };

            }, {});

            return values;
        },
        toFormValues(filters) {

            const values = Object.keys(filters ?? {}).reduce((currentFilter, id, value) => {
                let filterValue = {};

                if (typesMap[id] === 'array') {
                    filterValue = { ...filterValue, [id]: filters[id].inq };

                    return {
                        ...currentFilter,
                        ...filterValue
                    };
                }

                filterValue = { ...filterValue, [id]: filters[id] };

                return {
                    ...currentFilter,
                    ...filterValue
                };

            }, {});

            return values;
        }
    };
}