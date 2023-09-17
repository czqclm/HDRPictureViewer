import { createApp } from 'vue'
import "./style.css"
import App from './App.vue'
import './samples/node-api'
import '@arco-design/web-vue/dist/arco.css';


import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';

const app = createApp(App).use(ArcoVue).use(ArcoVueIcon).mount('#app').$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })

