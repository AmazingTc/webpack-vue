<template>
   <h1 class="home-title">hello Home</h1> 
   <img src="../../assets/images/963427.png" class="cc" alt="">
   <button>
    <router-link to="/about">跳转</router-link>
   </button>
</template>
<script>
export default{
    // eslint-disable-next-line vue/multi-word-component-names
    name:'Home',

}

</script>

<style scoped>
.home-title{
    color:pink;
    font-size: 28px;
}
.cc{
    width: 200px;
    height: 200px;
}
</style>