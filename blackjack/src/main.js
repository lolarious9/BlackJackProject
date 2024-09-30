import Vue from 'vue';
import { BootstrapVue } from 'bootstrap-vue';
import VueCompositionAPI from '@vue/composition-api';

import App from './App.vue';
import router from './router';
import store from './store';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(VueCompositionAPI);

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
