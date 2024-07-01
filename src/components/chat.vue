<template>
    <div class="chat-container">
        <div class="chat-list">
            <div class="chat-item" v-for="(item, index) in chatList" :key="index" @click="selectChat(index)">
                <div class="userlist-item">
                    <span>{{ item.name }}</span>
                </div>
            </div>
        </div>
        <div class="chat-box">
            <div class="chat-content">
                <div v-for="(message, index) in currentChat.messages" :key="index">
                    <div class="message-bubble">
                        <span>{{ message }}</span>
                    </div>
                </div>
            </div>
            <div class="chat-input">
                <div class="form">
                    <input type="text" v-model="inputMessage" class="input" placeholder="输入消息">

                    <span class="input-border"></span>
                </div>
                <button @click="sendMessage">发送</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const chatList = ref([
    { name: '123456', messages: ["hahah", "afdsafdss"] as string[] },
    { name: '1234', messages: [] as string[] },
    // ...
]);

const currentChat = ref(chatList.value[0]);
const inputMessage = ref<string>('');

function selectChat(index: number) {
    currentChat.value = chatList.value[index];
}

const sendMessage = () => {
    if (inputMessage.value.trim() !== '') {
        currentChat.value.messages.push(inputMessage.value);
        inputMessage.value = '';
    }
};
</script>

<style scoped>
.chat-container {
    display: flex;
    width: 60vw;
    height: 50vh;
    flex-direction: row;
}

.chat-list {
    border-right: 1px solid #ccc;
    flex: 3 1 auto;
    display: flex;
    flex-direction: column;
    width: 200px;
    justify-content: start;
    border-radius: 5px;
}

.chat-box {
    width: 70%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
}

.userlist-item {
    padding: 1em;
    color: white;
    cursor: pointer;
    border: 1px solid #777;
}

.chat-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    height: 80%;
    width: 100%;
    overflow-y: auto;
    padding: 1em;
}

.chat-input {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: 1em;
    padding: 1em;
}

.form {
    --width-of-input: 30vw;
    --border-height: 1px;
    --border-before-color: rgba(221, 221, 221, 0.39);
    --border-after-color: rgb(34, 197, 94);
    --input-hovered-color: rgb(34, 197, 94, 0.1);
    position: relative;
    width: var(--width-of-input);
}

.message-bubble {
    background-color: rgba(221, 221, 221, 0.39);
    color: white;
    padding: 10px;
    border-radius: 5px;
    margin: 5px;
    width: fit-content;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

span {
    background-color: transparent;
}

button {
    background-color: #555;
    border: none;
    padding: 0.3rem;
    font-size: 0.8rem;
    width: 4em;
    border-radius: 0.3rem;
    color: rgb(34, 197, 94);
    box-shadow: 0 0.1rem #222;
    cursor: pointer;
    margin: 0.3rem;
}

button:active {
    color: white;
    box-shadow: 0 0.2rem #000;
    transform: translateY(0.2rem);
}

button:hover:not(:disabled) {
    background: rgb(34, 197, 94);
    color: white;
}

button:disabled {
    cursor: auto;
    color: grey;
}

.form {
    --width-of-input: 40vw;
    --border-height: 1px;
    --border-before-color: rgba(221, 221, 221, 0.39);
    --border-after-color: rgb(34, 197, 94);
    --input-hovered-color: rgba(34, 197, 94, 0.1);
    position: relative;
    width: var(--width-of-input);
}

/* styling of Input */
.input {
    color: #fff;
    font-size: 0.9rem;
    background-color: transparent;
    width: 100%;
    box-sizing: border-box;
    padding-inline: 0.5em;
    padding-block: 0.7em;
    border: none;
    border-bottom: var(--border-height) solid var(--border-before-color);
}

/* styling of animated border */
.input-border {
    position: absolute;
    background: var(--border-after-color);
    width: 0%;
    height: 2px;
    bottom: 0;
    left: 0;
    transition: 0.3s;
}

/* Hover on Input */
input:hover {
    background: var(--input-hovered-color);
}

input:focus {
    outline: none;
}

/* here is code of animated border */
input:focus~.input-border {
    width: 100%;
}
</style>