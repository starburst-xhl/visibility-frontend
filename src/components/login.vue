<template>
  <div class="login">
    <form @submit.prevent="submitForm">
      <div class="wave-group">
        <input type="text" class="input" v-model="username" required>
        <span class="bar"></span>
        <label class="label">
          <span class="label-char" style="--index: 0">用</span>
          <span class="label-char" style="--index: 1">户</span>
          <span class="label-char" style="--index: 2">名</span>
        </label>
      </div>
      <div class="wave-group">
        <input type="password" class="input" v-model="password" required>
        <span class="bar"></span>
        <label class="label">
          <span class="label-char" style="--index: 0">密</span>
          <span class="label-char" style="--index: 1">码</span>
        </label>
      </div>
      <button type="submit" class="animated-button">
        <span class="button_name">登录</span>
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
import { defineEmits, defineProps } from 'vue';



const { isLogin } = defineProps(['isLogin']);
const username = ref('');
const password = ref('');
const router = useRouter();
let $emit = defineEmits(['toggleLogin', 'toggleManager']);

const submitForm = () => {

  const { cookies } = useCookies();

  axios.post('http://localhost:5173/api/login', {},
    { params: { username: username.value, password: password.value } })
    .then((response) => {
      console.log(response);
      if (response.data.code === 200) {
        cookies.set('token', response.data.token, 60 * 60 * 24 * 7);
        if (response.data.role === 'manager') {
          $emit('toggleManager', true);
        } else {
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
  width: 40vh;
  height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

button {
  margin: 12px;
}

.animated-button {
  position: relative;
  display: inline-block;
  padding: 0.7em 1.3em;
  border: none;
  font-size: 1em;
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
  background-color: rgb(34, 197, 94);
  border-radius: 50%;
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.23, 1, 0.320, 1);
}

.animated-button span:first-child {
  position: relative;
  z-index: 1;
}

.animated-button:hover {
  box-shadow: 0 0 0 5px rgb(17, 98, 47);
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

.wave-group {
  position: relative;
  margin: 0.5em;
}

.wave-group .input {
  font-size: 16px;
  padding: 10px 10px 10px 5px;
  display: block;
  width: 200px;
  border: none;
  border-bottom: 1px solid #515151;
  background: transparent;
  color: #ddd;
}

.wave-group .input:focus {
  outline: none;
}

.wave-group .label {
  color: #999;
  font-size: 18px;
  font-weight: normal;
  position: absolute;
  pointer-events: none;
  left: 5px;
  top: 10px;
  display: flex;
}

.wave-group .label-char {
  transition: 0.2s ease all;
  transition-delay: calc(var(--index) * .05s);
  color: #555;
  background: transparent;
}

.wave-group .input:focus~label .label-char,
.wave-group .input:valid~label .label-char {
  transform: translateY(-20px);
  font-size: 14px;
  color: rgb(34, 197, 94);
}

.wave-group .bar {
  position: relative;
  display: block;
  width: 200px;
}

.wave-group .bar:before,
.wave-group .bar:after {
  content: '';
  height: 2px;
  width: 0;
  bottom: 1px;
  position: absolute;
  background: rgb(17, 98, 47);
  transition: 0.2s ease all;
  -moz-transition: 0.2s ease all;
  -webkit-transition: 0.2s ease all;
}

.wave-group .bar:before {
  left: 50%;
}

.wave-group .bar:after {
  right: 50%;
}

.wave-group .input:focus~.bar:before,
.wave-group .input:focus~.bar:after {
  width: 50%;
}

.button_name {
  background: transparent;
}

input[type="password"]::-ms-reveal {
  display: none
}
</style>