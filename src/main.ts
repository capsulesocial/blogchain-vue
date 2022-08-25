/*
 * Copyright (c) 2021-2022 Capsule Social, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createMetaManager } from 'vue-meta';
import VueLazyLoad from 'vue3-lazyload';
import App from './App.vue';
import './index.css';
import router from './router';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const metaManager = createMetaManager();

createApp(App).use(pinia).use(router).use(metaManager).use(VueLazyLoad).mount('#app');
