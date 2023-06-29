import PaginationOptions from "@modules/_shared/domain/models/pagination-options";
import SortOptions from "@modules/_shared/domain/models/sort-options";

export function setWhere(
    url: URL,
    filter: any,
    initKey: string = "filters"
) {
    let search = url.searchParams;

    search.append(initKey, JSON.stringify(filter));
}

export function setLimitAndOffset(
    url: URL,
    pagination?: PaginationOptions
) {
    const search = url.searchParams;

    if (!pagination) return

    if (pagination.perPage) {
        search.append("limit", pagination.perPage + "");
    }

    if (pagination.page && pagination.perPage) {
        search.append(
            "skip",
            (pagination.page - 1) * pagination.perPage + ""
        );
    }
}

export function setOrder(
    url: URL,
    ordering: SortOptions = {
        field: "createdAt",
        order: "DESC",
    }
) {
    const search = url.searchParams;

    /* search.append("order", `${ordering.field} ${ordering.order}`);*/
    search.append("order", JSON.stringify({orderBy: ordering.field, orderType: ordering.order}));
}
