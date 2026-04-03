<script setup lang="ts">
import { AgGrid } from 'ag-grid-vue3-slotted'
import { themeQuartz } from 'ag-grid-community'

const theme = themeQuartz
</script>

<template>
  <div style="padding: 24px">
    <h1 style="margin-bottom: 16px; font-family: sans-serif">ag-grid-vue3-slotted demo</h1>
    <AgGrid
      :theme="theme"
      style="height: 400px"
      :column-defs="[
        { field: 'name', headerName: 'Name' },
        { field: 'price', headerName: 'Price' },
        { field: 'status', headerName: 'Status' },
      ]"
      :row-data="[
        { name: 'Widget', price: 9.99, status: 'active' },
        { name: 'Gadget', price: 19.99, status: 'inactive' },
      ]"
    >
      <!-- slot name = col_<field>, receives ICellRendererParams -->
      <template #col_status="{ data }">
        <span :style="{ color: data?.status === 'active' ? 'green' : 'red' }">
          {{ data?.status }}
        </span>
      </template>

      <template #col_price="{ data }">
        <strong>${{ data?.price.toFixed(2) }}</strong>
      </template>

      <template #header_name>
        <span style="color: blue">Custom Header</span>
      </template>
    </AgGrid>
  </div>
</template>
