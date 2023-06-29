import React from 'react';
import { TableLoadingSkeletonProps } from './TableLoadingSkeletonProps';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@main-components/Base/Table';
import { Skeleton } from '@main-components/Base/Skeleton';

export function TableLoadingSkeleton(props: TableLoadingSkeletonProps) {
    return (
        <Table BaseComponent={props?.BaseComponent}>
            <TableHead>
                <TableRow>
                    {
                        [...new Array(props.cellsCount)].map((_, key) => {
                            return (
                                <TableCell key={`t_${key}`}>
                                    <Skeleton
                                        loading
                                        type={'rectangle'}
                                    />
                                </TableCell>
                            );
                        })
                    }
                </TableRow>
            </TableHead>

            <TableBody>
                {
                    [...new Array(props.rowsCount)].map((i, index) => {
                        return (
                            <TableRow key={`s${index}`}>
                                {
                                    [...new Array(props.cellsCount)].map((index1, f) =>
                                        <TableCell key={`f${f}`}>
                                            <Skeleton
                                                loading
                                                type={'rectangle'}
                                            />
                                        </TableCell>
                                    )
                                }
                            </TableRow>
                        );
                    })
                }
            </TableBody>
        </Table>
    );
}
