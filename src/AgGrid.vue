<script lang="ts" setup generic="T, F extends string = string, I extends string = string">
import type { GridOptions, ICellRendererParams, IHeaderParams, INoRowsOverlayParams } from 'ag-grid-community'
import type { ColSlotFn, ColumnSlots, HeaderSlotFn, NoRowsSlotFn, SlottableColDef } from './types'
import { AgGridVue } from 'ag-grid-vue3'
import { defineComponent, h } from 'vue'

const { columnDefs, ...props } = defineProps<Omit<GridOptions<T>, 'columnDefs'> & { columnDefs?: SlottableColDef<T, F, I>[] }>()
const slots = defineSlots<ColumnSlots<T, F, I>>()

function resolveSlotRenderer(slotFn: ColSlotFn<T>) {
  return defineComponent({
    props: ['params'],
    setup: (p: { params: ICellRendererParams<T> }) => {
      return () => h('div', { style: 'display:contents' }, slotFn(p.params))
    },
  })
}

function resolveSlotHeader(slotFn: HeaderSlotFn) {
  return defineComponent({
    props: ['params'],
    setup: (p: { params: IHeaderParams }) => {
      return () => h('div', { style: 'display:contents' }, slotFn(p.params))
    },
  })
}

function resolveCellRenderer(col: NonNullable<typeof columnDefs>[number]) {
  if ('cellRenderer' in col && col.cellRenderer)
    return col.cellRenderer

  const key = col.colId || col.field
  if (!key)
    return undefined

  const slotFn = slots[`col_${key}` as keyof ColumnSlots<T, F, I>] as ColSlotFn<T> | undefined

  if (slotFn)
    return resolveSlotRenderer(slotFn)
}

function resolveHeaderComponent(col: NonNullable<typeof columnDefs>[number]) {
  if ('headerComponent' in col && col.headerComponent)
    return col.headerComponent

  const key = col.colId || col.field
  if (!key)
    return undefined

  const slotFn = slots[`header_${key}` as keyof ColumnSlots<T, F, I>] as HeaderSlotFn | undefined

  if (slotFn)
    return resolveSlotHeader(slotFn)
}

function resolveNoRowsOverlay(slotFn: NoRowsSlotFn<T>) {
  return defineComponent({
    props: ['params'],
    setup: (p: { params: INoRowsOverlayParams<T> }) => {
      return () => h('div', { style: 'display:contents' }, slotFn(p.params))
    },
  })
}

function makeColumnDefs() {
  return columnDefs?.map(col => ({
    ...col,
    cellRenderer: resolveCellRenderer(col),
    headerComponent: resolveHeaderComponent(col),
  }))
}

function makeGridProps() {
  const noRowsSlot = slots['no-rows']

  if (props.noRowsOverlayComponent || !noRowsSlot)
    return props

  return {
    ...props,
    noRowsOverlayComponent: resolveNoRowsOverlay(noRowsSlot),
  }
}
</script>

<template>
  <AgGridVue v-bind="{ ...makeGridProps(), columnDefs: makeColumnDefs() }" />
</template>
