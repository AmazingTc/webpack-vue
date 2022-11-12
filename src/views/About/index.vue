<template>
    <h1 class="home-title">
     hello About
    </h1>
    <button>
        <router-link to="/">Home</router-link>
    </button>
     <div class="box"></div> 
    <img :src=item.url style="width:50px;height:50px" alt="">
 </template>
 <script>
 export default{
     // eslint-disable-next-line vue/multi-word-component-names
     name:'About',
     data() {
        return {
            item:{
                name:'cc',
                url:require("../../assets/images/963427.png")
            }
        }
     },
 }
 
 </script>
 
 <style scoped>
 .home-title{
     color:black;
     font-size: 20px;
 }
 .box{
    height: 100px;
    width: 100px;
    background: url(../../assets/images/963427.png) no-repeat;
    background-position: center;
    background-size: cover;

 }
 </style>