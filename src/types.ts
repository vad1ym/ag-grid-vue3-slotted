import type { ColDef, ColGroupDef, ICellRendererParams, IHeaderParams, INoRowsOverlayParams } from 'ag-grid-community'

export type ColSlotFn<T> = (props: ICellRendererParams<T>) => any
export type HeaderSlotFn = (props: IHeaderParams) => any
export type NoRowsSlotFn<T> = (props: INoRowsOverlayParams<T>) => any

export type SlottableColDef<T, F extends string = string, I extends string = string> =
  | (Omit<ColDef<T>, 'field' | 'colId'> & { field?: F; colId?: I })
  | (Omit<ColGroupDef<T>, 'children'> & { children: SlottableColDef<T, F, I>[] })

export type ColumnSlots<T, F extends string = string, I extends string = string> = {
  [K in F as `col_${K}`]?: ColSlotFn<T>
} & {
  [K in I as `col_${K}`]?: ColSlotFn<T>
} & {
  [K in F as `header_${K}`]?: HeaderSlotFn
} & {
  [K in I as `header_${K}`]?: HeaderSlotFn
} & {
  'no-rows'?: NoRowsSlotFn<T>
}
