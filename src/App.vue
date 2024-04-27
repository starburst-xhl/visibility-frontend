<template>
  <main :class="{ dark: isDark }">
    <div class="sidebar">
      <nav class="nav-links">
        <div class="router-link-container" v-if="isLogin">
          <router-link to="/home" class="home-link">个人信息</router-link>
        </div>
        <div class="router-link-container" v-if="isLogin && isManager">
          <router-link to="/home" class="home-link">用户管理</router-link>
          </div>

        <!-- <div class="router-link-container" v-if="isLogin">
          <router-link to="/home" class="home-link">个人信息</router-link>
        </div> -->
        <!-- <router-link to="/about">关于</router-link> -->
      </nav>
    </div>
    <div class="page">
      <header class="headbar">
        <h1>Welcome to Our Site</h1>
      </header>

      <div class="content">
        <router-view @toggleLogin="toggleLogin"></router-view>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { RouterView } from 'vue-router';
import login from './components/login.vue'
import home from './components/home.vue'


const isLogin = ref(false)
const isManager = ref(false)
const router = useRouter()


import axios from 'axios'
import { useCookies } from 'vue3-cookies'

const { cookies } = useCookies()

let token = cookies.get("token")

onMounted(async () => {
  if (token){
    try {
      const response = await axios.get('http://localhost:5173/api/login/token',{
        headers: {
          Authorization: `${token}`
        }})
      isLogin.value = response.data.isLogin
    } catch (error) {
    console.error(error)
    }
  }
  if (!isLogin.value) {
    router.push('/login')
    alert('请先登录')
  }else{
    router.push('/home')
  }
})
const isDark = ref(true)

const toggleLogin = (islogin: boolean) => {
  isLogin.value = islogin
}

// const toggleDarkMode = () => {
//   isDark.value = !isDark.value
// }
</script>

<!-- 默认样式 -->
<style scoped>
html,body{
  height: 100%;
  width: 100%;
}

main {
  display: flex;
  height: 100vh;
  width: 100vw;
  flex-direction: row;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: #fff;
  font-size: 1.2em;
  text-decoration: none;
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
}

.router-link+.router-link {
  margin-top: 20px;
}

.page {
  padding: 20px;
  flex: 5 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
}

.sidebar {
  flex: 1 1 auto;
  background: linear-gradient(rgb(187, 247, 208), rgb(34, 197, 94));
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  padding: 20px;
}

.content {
  padding: 20px;
  flex: 7 1 auto;
}

.headbar {
  margin-top: 5vh;
  flex: 1 1 auto;
}
</style>

<!-- 加入以下样式到style标签中，使得dark模式下的样式生效： -->
<style> 
.dark h1,h2,h3,h4,h5,h6,p,span{
  background-color: #333;
  color: #fff;
}
.dark div{
  background-color: #333;
  color: #333;
}
.dark .sidebar{
  background: linear-gradient(#333, rgb(17, 98, 47));
  color: #333;
}

a.router-link-exact-active{
  text-decoration: underline;
}
</style>
