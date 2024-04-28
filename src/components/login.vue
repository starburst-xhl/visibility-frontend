<template>
    <div class="login">
        <form @submit.prevent="submitForm">
            <h2>登录</h2>
                <div class="coolinput">
                    <label for="input" class="text">用户名:</label>
                    <input type="text" class="input" v-model="username" required>
                </div>
                <div class="coolinput">
                    <label for="input" class="text">密码:</label>
                    <input type="password" class="input" v-model="password" required>
                </div>
            <button type="submit" class="animated-button">
                <span>登录</span>
                <span></span>
            </button>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useCookies } from 'vue3-cookies';
import { defineEmits,defineProps } from 'vue';



const { isLogin } = defineProps(['isLogin']);
const username = ref('');
const password = ref('');
const router = useRouter();
let $emit = defineEmits(['toggleLogin','toggleManager']);

const submitForm = () => {

  const { cookies } = useCookies();
  
  axios.post('http://localhost:5173/api/login', {},
  {params: {username: username.value, password: password.value}})
  .then((response) => {
    console.log(response);
    if (response.data.code === 200) {
      cookies.set('token', response.data.token, 60 * 60 * 24 * 7);
      if (response.data.role === 'manager') {
        $emit('toggleManager', true);
      }else{
        $emit('toggleManager', false);
      }
      $emit('toggleLogin', true);
      alert('登录成功');
      router.push("/home");
    } else {
      alert('登录失败');
      throw new Error('Login failed');
    }
  })
  .catch((error) => {
    console.error(error);
    if (error.response && error.response.status === 101) {
      alert('密码错误');
    } else if (error.response && error.response.status === 100) {
      alert('用户不存在');
    } else {
      alert('登录失败');
    }
  });
};



</script>

<style scoped>
form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}
.login {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

button{
    margin: 12px;
}
.animated-button {
  position: relative;
  display: inline-block;
  padding: 12px 24px;
  border: none;
  font-size: 16px;
  background-color: inherit;
  border-radius: 100px;
  font-weight: 600;
  color: #ffffff40;
  box-shadow: 0 0 0 2px #ffffff20;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
}

.animated-button span:last-child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background-color: #2196F3;
  border-radius: 50%;
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.23, 1, 0.320, 1);
}

.animated-button span:first-child {
  position: relative;
  z-index: 1;
}

.animated-button:hover {
  box-shadow: 0 0 0 5px #2195f360;
  color: #ffffff;
}

.animated-button:active {
  scale: 0.95;
}

.animated-button:hover span:last-child {
  width: 150px;
  height: 150px;
  opacity: 1;
}

.coolinput {
  display: flex;
  flex-direction: column;
  width: fit-content;
  position: static;
  max-width: 240px;
}

.coolinput label.text {
  font-size: 0.75rem;
  color: rgb(34, 197, 94);
  font-weight: 700;
  position: relative;
  top: 0.5rem;
  margin: 0 0 0 7px;
  padding: 0 3px;
  background: #333;
  width: fit-content;
}

.coolinput input.input {
  padding: 11px 10px;
  font-size: 0.75rem;
  border: 2px rgb(34, 197, 94) solid;
  border-radius: 5px;
  background: #333;
}

.coolinput input.input:focus {
  outline: none;
}

input{
    color: #aaa;
    font: 1.2em sans-serif;
}
</style>