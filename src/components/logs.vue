<template>
    <div class="logs_container">
        <table>
            <thead>
                <tr>
                    <th><p class="content_head">内容</p></th>
                    <th><p class="date_head">时间</p></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="log in logs" :key="log.id">
                    <td><p>{{ log.content }}</p></td>
                    <td><p>{{ log.date }}</p></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useCookies } from 'vue3-cookies';
import type { Log } from '@/assets/types';

const { cookies } = useCookies()
const logs = ref<Array<Log>>([])

const myLogs = [
    {
        id: 1,
        content: '用户123456登录',
        date: new Date("2024-05-16 22:36:17")
    },
    {
        id: 2,
        content: '用户123456登录',
        date: new Date("2024-05-16 22:36:38")
    }
]

const getLogs = async () => {
    const response = await axios.get('http://localhost:5173/api/log/all', {
        headers: {
            Authorization: `${cookies.get('token')}`
        }
    }).then((response) => {
        logs.value = response.data
    }).catch((error) => {
        console.log(error)
    })
}

// getLogs();
logs.value = myLogs;
</script>

<style scoped>
.logs_container {
    margin: 20px;
    width: 50vw;
    display: flex;
    justify-content: center;
    align-items: top;
}
td {
    padding: 0.5rem;
}

td span {
    background-color: transparent;
}

th span {
    color: rgb(34, 197, 94);
    background-color: transparent;
}

th {
    padding: 0.5rem;
    text-align: left;
}

thead {
    border-color: aliceblue;
    background-color: #444;
}

p {
    color: white;
    background-color: transparent;
}

.content_head {
    color: rgb(34, 197, 94);
    width: 20vw;
}

.date_head {
    color: rgb(34, 197, 94);
    width: 15vw;
}
</style>