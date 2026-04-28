<script lang="ts" setup generic="T, F extends string = string, I extends string = string">
import type {
  ColDef,
  GridOptions,
  ICellRendererParams,
  IHeaderParams,
  INoRowsOverlayParams,
} from 'ag-grid-community'
import type {
  ColSlotFn,
  ColumnSlots,
  HeaderSlotFn,
  NoRowsSlotFn,
  SlottableColDef,
} from './types'
import { AgGridVue } from 'ag-grid-vue3'
import { computed, defineComponent, h } from 'vue'

type Props = Omit<GridOptions<T>, 'columnDefs'> & {
  columnDefs?: SlottableColDef<T, F, I>[]
}

type LeafColDef = Omit<ColDef<T>, 'field' | 'colId'> & {
  field?: F
  colId?: I
}

type AnySlotParams =
  | ICellRendererParams<T>
  | IHeaderParams
  | INoRowsOverlayParams<T>

const props = defineProps<Props>()
const slots = defineSlots<ColumnSlots<T, F, I>>()

const cellRendererCache = new WeakMap<ColSlotFn<T>, ReturnType<typeof defineComponent>>()
const headerRendererCache = new WeakMap<HeaderSlotFn, ReturnType<typeof defineComponent>>()
const noRowsOverlayCache = new WeakMap<NoRowsSlotFn<T>, ReturnType<typeof defineComponent>>()

function createSlotComponent(
  name: string,
  slotFn: (params: AnySlotParams) => any,
) {
  return defineComponent({
    name,
    props: ['params'],
    setup(props, { expose }) {
      expose({
        refresh() {
          return true
        },
      })

      return () => h('div', { style: 'display:contents' }, slotFn(props.params))
    },
  })
}

function resolveSlotRenderer(slotFn: ColSlotFn<T>) {
  const cached = cellRendererCache.get(slotFn)
  if (cached)
    return cached

  const component = createSlotComponent(
    'AgGridSlotCellRenderer',
    slotFn as unknown as (params: AnySlotParams) => any,
  )

  cellRendererCache.set(slotFn, component)
  return component
}

function resolveSlotHeader(slotFn: HeaderSlotFn) {
  const cached = headerRendererCache.get(slotFn)
  if (cached)
    return cached

  const component = createSlotComponent(
    'AgGridSlotHeader',
    slotFn as unknown as (params: AnySlotParams) => any,
  )

  headerRendererCache.set(slotFn, component)
  return component
}

function resolveNoRowsOverlay(slotFn: NoRowsSlotFn<T>) {
  const cached = noRowsOverlayCache.get(slotFn)
  if (cached)
    return cached

  const component = createSlotComponent(
    'AgGridSlotNoRowsOverlay',
    slotFn as unknown as (params: AnySlotParams) => any,
  )

  noRowsOverlayCache.set(slotFn, component)
  return component
}

function isLeafCol(col: NonNullable<Props['columnDefs']>[number]): col is LeafColDef {
  return !('children' in col)
}

function resolveCellRenderer(col: LeafColDef) {
  if (col.cellRenderer)
    return col.cellRenderer

  const key = col.colId || col.field
  if (!key)
    return undefined

  const slotFn = slots[`col_${key}` as keyof ColumnSlots<T, F, I>] as ColSlotFn<T> | undefined

  return slotFn ? resolveSlotRenderer(slotFn) : undefined
}

function resolveHeaderComponent(col: LeafColDef) {
  if (col.headerComponent)
    return col.headerComponent

  const key = col.colId || col.field
  if (!key)
    return undefined

  const slotFn = slots[`header_${key}` as keyof ColumnSlots<T, F, I>] as HeaderSlotFn | undefined

  return slotFn ? resolveSlotHeader(slotFn) : undefined
}

function processCol(col: NonNullable<Props['columnDefs']>[number]): any {
  if (!isLeafCol(col)) {
    return {
      ...col,
      children: col.children.map(processCol),
    }
  }

  const cellRenderer = resolveCellRenderer(col)
  const headerComponent = resolveHeaderComponent(col)

  return {
    ...col,
    ...(cellRenderer ? { cellRenderer } : {}),
    ...(headerComponent ? { headerComponent } : {}),
  }
}

const resolvedColumnDefs = computed(() => {
  return props.columnDefs?.map(processCol)
})

const resolvedGridProps = computed(() => {
  const { columnDefs, ...gridProps } = props

  const noRowsSlot = slots['no-rows']

  if (gridProps.noRowsOverlayComponent || !noRowsSlot)
    return gridProps

  return {
    ...gridProps,
    noRowsOverlayComponent: resolveNoRowsOverlay(noRowsSlot),
  }
})
</script>

<template>
  <AgGridVue
    v-bind="resolvedGridProps"
    :column-defs="resolvedColumnDefs"
  />
</template>