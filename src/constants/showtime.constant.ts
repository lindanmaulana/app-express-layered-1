export const SORTABLE_COLUMNS = {
    createdAt: "created_at",
    movieTitle: "movie_title",
    studioName: "studio_name",
    broadcastTime: "broadcast_time"
} as const

export type SortableColumns = (typeof SORTABLE_COLUMNS) [keyof typeof SORTABLE_COLUMNS]
export const SORTABLE_COLUMNS_VALUE = Object.values(SORTABLE_COLUMNS) as [SortableColumns, ...SortableColumns[]]