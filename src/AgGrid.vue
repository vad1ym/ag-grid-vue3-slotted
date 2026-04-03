<script lang="ts" setup generic="T">
import type { GridOptions, ICellRendererParams } from 'ag-grid-community'
import { AgGridVue } from 'ag-grid-vue3'
import { defineComponent } from 'vue'

export type ColSlotFn<T> = (props: ICellRendererParams<T>) => any

export type ColumnSlots<T> = {
  [K in keyof T as `col_${string & K}`]?: ColSlotFn<T>
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

function resolveCellRenderer(col: NonNullable<typeof columnDefs>[number]) {
  if ('cellRenderer' in col && col.cellRenderer)
    return col.cellRenderer

  const field = 'field' in col ? (col.field as string) : undefined
  const slotKey = field ? (`col_${field}` as keyof ColumnSlots<T>) : undefined
  const slotFn = slotKey ? (slots[slotKey] as ColSlotFn<T> | undefined) : undefined

  return slotFn ? resolveSlotRenderer(slotFn) : undefined
}

function makeColumnDefs() {
  return columnDefs?.map(col => ({ ...col, cellRenderer: resolveCellRenderer(col) }))
}
</script>

<template>
  <AgGridVue v-bind="{ ...props, columnDefs: makeColumnDefs() }" />
</template>
