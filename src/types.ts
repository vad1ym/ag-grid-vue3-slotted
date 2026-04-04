import type { ColDef, ICellRendererParams, IHeaderParams } from 'ag-grid-community'

export type ColSlotFn<T> = (props: ICellRendererParams<T>) => any
export type HeaderSlotFn = (props: IHeaderParams) => any

export type SlottableColDef<T, F extends string = string, I extends string = string> =
  Omit<ColDef<T>, 'field' | 'colId'> & { field?: F; colId?: I }

export type ColumnSlots<T, F extends string = string, I extends string = string> = {
  [K in F as `col_${K}`]?: ColSlotFn<T>
} & {
  [K in I as `col_${K}`]?: ColSlotFn<T>
} & {
  [K in F as `header_${K}`]?: HeaderSlotFn
} & {
  [K in I as `header_${K}`]?: HeaderSlotFn
}
