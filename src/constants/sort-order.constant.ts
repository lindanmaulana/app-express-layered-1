export const SORTABLE_ORDER = {
    ASC: 'ASC',
    DESC: "DESC"
} as const

export type SortableOrder = (typeof SORTABLE_ORDER) [keyof typeof SORTABLE_ORDER]
export const SORTABLE_ORDER_VALUES = Object.values(SORTABLE_ORDER) as [SortableOrder, ...SortableOrder[]]