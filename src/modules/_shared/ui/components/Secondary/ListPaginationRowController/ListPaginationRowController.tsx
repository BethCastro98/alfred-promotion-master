import useListPaginationContext from '@main-components/Utilities/ListContextProvider/hooks/use-list-pagination-context';
import { PaginationRow } from '@main-components/Layout/PaginationRow';
import React from 'react';
import { Box } from '@main-components/Base';
import { Platform } from 'react-native';

export function ListPaginationRowController({ listRef }: { listRef?: any }) {
    const { perPage, setPage, setPerPage, page, total } = useListPaginationContext();
    const totalPages = Math.ceil(total / perPage);
    if (totalPages <= 1) return <Box />;

    return (
        <Box
            marginVertical={{
                phone: 'm',
                large: 's'
            }}
        >
            <PaginationRow
                onChangePage={(page) => {
                    setPage(page);

                    if (Platform.OS == 'web') {
                        window.scrollTo({
                            top: 0
                        });
                    } else {
                        listRef?.current?.scrollToOffset({ animated: true, offset: 0 });
                    }

                }}
                align={Platform.select({
                    web: 'end',
                    default: 'center'
                } as any)}
                page={page}
                onChangePerPage={(perPage) => setPerPage(perPage)}
                perPage={perPage}
                total={total}
                totalPages={totalPages}
            />
        </Box>
    );
}