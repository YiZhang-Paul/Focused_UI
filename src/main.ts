import { createApp } from 'vue';
import 'overlayscrollbars/css/OverlayScrollbars.css';

import App from './app.vue';
import store from './store';

createApp(App).use(store).mount('#app');
