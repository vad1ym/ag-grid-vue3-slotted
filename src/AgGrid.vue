<script lang="ts" setup generic="T">
import type { GridOptions, ICellRendererParams, IHeaderParams } from 'ag-grid-community'
import { AgGridVue } from 'ag-grid-vue3'
import { defineComponent } from 'vue'

export type ColSlotFn<T> = (props: ICellRendererParams<T>) => any
export type HeaderSlotFn = (props: IHeaderParams) => any

export type ColumnSlots<T> = {
  [K in keyof T as `col_${string & K}`]?: ColSlotFn<T>
} & {
  [K in keyof T as `header_${string & K}`]?: HeaderSlotFn
}

const { columnDefs, ...props } = defineProps<GridOptions<T>>()
const slots = defineSlots<ColumnSlots<T>>()

function resolveSlotRenderer(slotFn: ColSlotFn<T>) {
  return defineComponent({
    props: ['params'],
    setup: (p: { params: ICellRendererParams<T> }) => {
      return () => slotFn(p.params)
    },
  })
}

function resolveSlotHeader(slotFn: HeaderSlotFn) {
  return defineComponent({
    props: ['params'],
    setup: (p: { params: IHeaderParams }) => {
      return () => slotFn(p.params)
    },
  })
}

function resolveCellRenderer(col: NonNullable<typeof columnDefs>[number]) {
  if ('cellRenderer' in col && col.cellRenderer)
    return col.cellRenderer

  if (!('field' in col) || !col.field)
    return undefined

  const slotFn = slots[`col_${col.field}` as keyof ColumnSlots<T>] as ColSlotFn<T> | undefined

  if (slotFn)
    return resolveSlotRenderer(slotFn)
}

function resolveHeaderComponent(col: NonNullable<typeof columnDefs>[number]) {
  if ('headerComponent' in col && col.headerComponent)
    return col.headerComponent

  if (!('field' in col) || !col.field)
    return undefined

  const slotFn = slots[`header_${col.field}` as keyof ColumnSlots<T>] as HeaderSlotFn | undefined

  if (slotFn)
    return resolveSlotHeader(slotFn)
}

function makeColumnDefs() {
  return columnDefs?.map(col => ({
    ...col,
    cellRenderer: resolveCellRenderer(col),
    headerComponent: resolveHeaderComponent(col),
  }))
}
</script>

<template>
  <AgGridVue v-bind="{ ...props, columnDefs: makeColumnDefs() }" />
</template>
