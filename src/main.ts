import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createMetaManager } from 'vue-meta';
import VueLazyLoad from 'vue3-lazyload';
import App from './App.vue';
import './index.css';
import router from './router';
import { initBackend } from './plugins/backend';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const metaManager = createMetaManager();

initBackend().then(() => {
	createApp(App).use(pinia).use(router).use(metaManager).use(VueLazyLoad).mount('#app');
});
