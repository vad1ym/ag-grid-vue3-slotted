<script setup lang="ts">
import { ref } from 'vue'
import { AgGrid } from 'ag-grid-vue3-slotted'
import { themeQuartz } from 'ag-grid-community'

type ProductRow = {
  name: string
  price: number
  status: 'active' | 'inactive'
}

const theme = themeQuartz

const allRows: ProductRow[] = [
  { name: 'Widget', price: 9.99, status: 'active' },
  { name: 'Gadget', price: 19.99, status: 'inactive' },
]

const rowData = ref<ProductRow[]>([...allRows])

function showData() {
  rowData.value = [...allRows]
}

function showEmptyState() {
  rowData.value = []
}
</script>

<template>
  <div class="demo">
    <div class="demo__header">
      <div>
        <h1>ag-grid-vue3-slotted demo</h1>
        <p>Switch between populated data and the custom <code>#no-rows</code> overlay.</p>
      </div>

      <div class="demo__actions">
        <button type="button" @click="showData">
          Show data
        </button>
        <button type="button" @click="showEmptyState">
          Show empty state
        </button>
      </div>
    </div>

    <AgGrid
      :theme="theme"
      class="demo__grid"
      :column-defs="[
        { field: 'name', headerName: 'Name' },
        { field: 'price', headerName: 'Price' },
        { field: 'status', headerName: 'Status' },
        { colId: 'actions', headerName: 'Actions' },
      ]"
      :row-data="rowData"
    >
      <template #col_status="{ data }">
        <span :style="{ color: data?.status === 'active' ? 'green' : 'red' }">
          {{ data?.status }}
        </span>
      </template>

      <template #col_price="{ data }">
        <strong>${{ data?.price.toFixed(2) }}</strong>
      </template>

      <template #col_actions="{ data }">
        <button type="button">
          Click {{ data?.name }}
        </button>
      </template>

      <template #header_name>
        <span style="color: blue">Custom Header</span>
      </template>

      <template #no-rows>
        <div class="empty-state">
          <strong>No products yet</strong>
          <p>Use the buttons above to switch the grid back to the populated state.</p>
        </div>
      </template>
    </AgGrid>
  </div>
</template>

<style scoped>
.demo {
  padding: 24px;
}

.demo__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  font-family: sans-serif;
}

.demo__header h1 {
  margin: 0 0 8px;
}

.demo__header p {
  margin: 0;
  color: #4b5563;
}

.demo__actions {
  display: flex;
  gap: 12px;
}

.demo__actions button {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  padding: 10px 14px;
  font: inherit;
  cursor: pointer;
}

.demo__grid {
  height: 400px;
}

.empty-state {
  display: grid;
  gap: 8px;
  place-items: center;
  text-align: center;
  color: #374151;
  padding: 24px;
  font-family: sans-serif;
}

.empty-state p {
  margin: 0;
  max-width: 320px;
}
</style>
