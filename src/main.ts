import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import Toast, { type PluginOptions, POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);

const options: PluginOptions = {
  position: POSITION.TOP_CENTER,
  timeout: 5000
};

app.use(Toast, options);

app.mount('#app');
