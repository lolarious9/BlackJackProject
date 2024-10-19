import './assets/main.css'
import {createBootstrap} from 'bootstrap-vue-next'

// Add the necessary CSS
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

import { createApp } from 'vue'
import { createStore } from 'vuex'

import App from './App.vue'


import router from './router'
import deck from '@/store/deck';
import hand from '@/store/hand';


const vuexStore = createStore({modules: {
    hand, deck,
  }})
const app = createApp(App)
app.use(createBootstrap()) // Important
app.use(vuexStore)
app.use(router)

app.mount('#app')
