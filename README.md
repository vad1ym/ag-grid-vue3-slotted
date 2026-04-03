# ag-grid-vue3-slotted

AG Grid Vue 3 wrapper that lets you render cell content using named Vue slots instead of writing `cellRenderer` components.

## Install

```bash
npm install ag-grid-vue3-slotted
# or
pnpm add ag-grid-vue3-slotted
# or
yarn add ag-grid-vue3-slotted
```

## Usage

```vue
<script setup lang="ts">
import { AgGrid } from 'ag-grid-vue3-slotted'
import type { ColDef } from 'ag-grid-community'

interface Product {
  name: string
  price: number
  status: 'active' | 'inactive'
}

const columnDefs: ColDef<Product>[] = [
  { field: 'name', headerName: 'Name' },
  { field: 'price', headerName: 'Price' },
  { field: 'status', headerName: 'Status' },
]

const rowData: Product[] = [
  { name: 'Widget', price: 9.99, status: 'active' },
  { name: 'Gadget', price: 19.99, status: 'inactive' },
]
</script>

<template>
  <AgGrid
    class="ag-theme-alpine"
    style="height: 400px"
    :column-defs="columnDefs"
    :row-data="rowData"
  >
    <!-- slot name = col_<field> -->
    <template #col_status="{ row }">
      <span :class="row.status === 'active' ? 'text-green-600' : 'text-red-500'">
        {{ row.status }}
      </span>
    </template>

    <template #col_price="{ row }">
      <strong>${{ row.price.toFixed(2) }}</strong>
    </template>
  </AgGrid>
</template>
```

Slot names follow the pattern `col_<field>` where `<field>` matches the `field` property of the column definition.

## Types

```ts
// Slot render function for a column
type ColSlotFn<T> = (props: { row: T }) => any

// Map of all available column slots derived from your row type T
type ColumnSlots<T> = {
  [K in keyof T as `col_${string & K}`]?: ColSlotFn<T>
}
```

Both types are exported and can be imported from the package:

```ts
import type { ColSlotFn, ColumnSlots } from 'ag-grid-vue3-slotted'
```

## Slot vs cellRenderer priority

If a column definition already has a `cellRenderer` set, it takes priority and the corresponding slot is ignored. Slots are only used when no `cellRenderer` is defined on the column.

## Peer dependencies

| Package             | Version   |
| ------------------- | --------- |
| `vue`               | `>=3`     |
| `ag-grid-community` | `>=35 <36`|
| `ag-grid-vue3`      | `>=35 <36`|
