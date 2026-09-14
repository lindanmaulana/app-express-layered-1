
export const SORTABLE_COLUMNS = {
    createdAt: "created_at",
    name: "name",
} as const


export type SortableColumns = (typeof SORTABLE_COLUMNS) [keyof typeof SORTABLE_COLUMNS]
export const SORTABLE_COLUMNS_VALUE = Object.values(SORTABLE_COLUMNS) as [SortableColumns, ...SortableColumns[]]