import { defineStore } from "pinia";
import { ref } from "vue";

export const store = defineStore('main', () => {
  const count = ref(1)

  function increment() {
    count.value++
    console.log('increment', count.value)
  }

  function decrement() {
    count.value--
    console.log('decrement', count.value)
  }
  
  return {
    count,
    increment,
    decrement
  }
})