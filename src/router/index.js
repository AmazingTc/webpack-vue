import {createRouter,createWebHashHistory} from 'vue-router'
import routes from './routes' //路由文件
// 配置路由
const router=createRouter({
    history:createWebHashHistory(),
    routes
})
export default router