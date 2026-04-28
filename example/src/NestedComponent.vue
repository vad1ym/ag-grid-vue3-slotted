<script lang="ts" setup>
import { onMounted, ref } from 'vue';
// import { store } from './store';

// const $store = store()

const props = defineProps<{
  initialValue: number
}>()

onMounted(() => {
  console.log('NestedComponent mounted')
})

console.log('NestedComponent created')

const count = ref(0)

function increment() {
  count.value++
}

function decrement() {
  count.value--
}
</script>

<template>
  <div>
    {{ props.initialValue }} / {{ count }}
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
  </div>
</template>
