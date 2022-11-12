const Home= ()  =>import('../views/home/index.vue')
const About= () =>import('../views/About/index.vue')
const routes=[
    {
        path:'/',
        component:Home
    },
    {
        path:'/about',
        name:'About',
        component:About
    }
]
export default routes