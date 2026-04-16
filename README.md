# ag-grid-vue3-slotted

[![npm](https://img.shields.io/npm/v/ag-grid-vue3-slotted)](https://www.npmjs.com/package/ag-grid-vue3-slotted)
[![license](https://img.shields.io/npm/l/ag-grid-vue3-slotted)](https://github.com/vad1ym/ag-grid-vue3-slotted/blob/main/LICENSE)

AG Grid Vue 3 wrapper that lets you render cell content using named Vue slots instead of writing `cellRenderer` components.

## Install

```bash
npm install ag-grid-vue3-slotted ag-grid-community ag-grid-vue3
# or
pnpm add ag-grid-vue3-slotted ag-grid-community ag-grid-vue3
# or
yarn add ag-grid-vue3-slotted ag-grid-community ag-grid-vue3
```

## Setup

Register AG Grid modules once in your app entry point (e.g. `main.ts`):

```ts
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'

ModuleRegistry.registerModules([AllCommunityModule])
```

## Usage

Instead of importing `AgGridVue` from `ag-grid-vue3`, import `AgGrid` from `ag-grid-vue3-slotted` — it wraps the original component and adds slot support.

```vue
<script setup lang="ts">
import { AgGrid } from 'ag-grid-vue3-slotted'
</script>

<template>
  <AgGrid
    class="ag-theme-alpine"
    style="height: 400px"
    :column-defs="[
      { field: 'name', headerName: 'Name' },
      { field: 'price', headerName: 'Price' },
      { field: 'status', headerName: 'Status' },
      { colId: 'actions', headerName: 'Actions' },
    ]"
    :row-data="[
      { name: 'Widget', price: 9.99, status: 'active' },
      { name: 'Gadget', price: 19.99, status: 'inactive' },
    ]"
  >
    <!-- slot name = col_<field>, receives ICellRendererParams -->
    <template #col_status="{ data }">
      <span :class="data?.status === 'active' ? 'text-green-600' : 'text-red-500'">
        {{ data?.status }}
      </span>
    </template>

    <template #col_price="{ data }">
      <strong>${{ data?.price.toFixed(2) }}</strong>
    </template>

    <!-- slot name = col_<colId> when the column has no field -->
    <template #col_actions="{ data }">
      <button @click="remove(data)">Delete</button>
    </template>

    <!-- slot name = no-rows, rendered inside noRowsOverlayComponent -->
    <template #no-rows>
      <div>No rows to display.</div>
    </template>
  </AgGrid>
</template>
```

Slot names follow the pattern `col_<field>` where `<field>` matches the `field` property of the column definition. For columns without a `field` (e.g. action columns), use `col_<colId>` where `<colId>` matches the `colId` property instead.

## Header slots

You can also customize the header label using `header_<field>` slots. Only the text content of the header is replaced — all AG Grid controls (sort arrow, filter icon, column menu) remain intact.

```vue
<!-- slot name = header_<field>, receives IHeaderParams -->
<template #header_status="{ displayName }">
  <em>{{ displayName }} ⚡</em>
</template>

<!-- slot name = header_<colId> when the column has no field -->
<template #header_actions="{ displayName }">
  <em>{{ displayName }}</em>
</template>
```

Slot names follow the pattern `header_<field>`, or `header_<colId>` for columns without a `field`. The slot receives [`IHeaderParams`](https://www.ag-grid.com/javascript-data-grid/component-header/) from `ag-grid-community`.

## No-Rows slot

Use the `no-rows` slot to replace AG Grid's default no-rows overlay with Vue template content.

```vue
<template #no-rows>
  <div>Nothing here yet.</div>
</template>
```

The `no-rows` slot is wired into `noRowsOverlayComponent`. If `noRowsOverlayComponent` is already set on the grid options, that explicit component still takes priority.

## Slot vs explicit renderer priority

If a column definition already has `cellRenderer` or `headerComponent` set, it takes priority and the corresponding slot is ignored. Slots are only used when no renderer is defined on the column. Likewise, the `no-rows` slot is ignored when `noRowsOverlayComponent` is already provided explicitly.

## Example

A full working example is available in the [example/](https://github.com/vad1ym/ag-grid-vue3-slotted/tree/main/example) directory.

## Peer dependencies

| Package             | Version   |
| ------------------- | --------- |
| `vue`               | `>=3`     |
| `ag-grid-community` | `>=35 <36`|
| `ag-grid-vue3`      | `>=35 <36`|
