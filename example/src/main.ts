import { createApp } from 'vue'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import App from './App.vue'
import { createPinia } from 'pinia'
import { PiniaColada } from '@pinia/colada'

ModuleRegistry.registerModules([AllCommunityModule])

createApp(App)
  .use(createPinia())
  .use(PiniaColada, {
    queryOptions: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  })
  .mount('#app')
