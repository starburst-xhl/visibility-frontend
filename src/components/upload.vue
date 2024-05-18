<template>
    <div class="upload_container">
        <button class="animated-button">
        <span class="button_name">上传</span>
        <span></span>
      </button>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

</script>

<style scoped>
.upload_container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 50vw;
    height: 50vh;
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

span{
    background-color: transparent;
}
</style>