import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createMetaManager } from 'vue-meta';
import App from './App.vue';
import './index.css';
import router from './router';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const metaManager = createMetaManager();

createApp(App).use(pinia).use(router).use(metaManager).mount('#app');
