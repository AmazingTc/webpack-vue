import { createApp } from "vue";
import App from './App.vue'
import router from './router/index.js'

// ts测试
// const a=require('./test.ts')
// a()
const app=createApp(App)
app.use(router)
app.mount('#app')