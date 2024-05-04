<template>
    <div class="user-info">
        <table>
            <thead>
                <tr>
                    <th colspan="2">
                        <div class="table_head_text">
                            <p>用户信息</p>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>
                        <p>用户名</p>
                    </th>
                    <td>
                        <p>{{ user.username }}</p>
                    </td>
                </tr>
                <tr>
                    <th>
                        <p>职务</p>
                    </th>
                    <td>
                        <p>{{ user.role }}</p>
                    </td>
                </tr>
                <tr>
                    <th>
                        <p>手机号</p>
                    </th>
                    <td>
                        <p>{{ user.phone_nbr }}</p>
                    </td>
                </tr>
                <tr>
                    <th>
                        <p>密码</p>
                    </th>
                    <td>
                        <input v-model="user.password" v-if="updateMode" type="password" />
                        <p v-else>******</p>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="buttons">
            <button @click="getUserInfo" v-if="!updateMode">刷新</button>
            <button @click="toggleUpdateMode" v-if="!updateMode">修改密码</button>
            <button @click="toggleUpdateMode" v-if="updateMode">取消</button>
            <button @click="updateUserInfo" v-if="updateMode">确认</button>
            <button @click="logout" v-if="!updateMode">退出登录</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import axios from 'axios';
import { useCookies } from 'vue3-cookies';
import { useRouter } from 'vue-router';
import { defineEmits } from 'vue';

const router = useRouter();
let $emit = defineEmits(['toggleLogin', 'toggleManager']);

let user = ref({
    username: '',
    role: '',
    create_at: '',
    phone_nbr: '',
    id: '',
    password: ''
});

const { cookies } = useCookies();
let token = cookies.get('token');

const logout = () => {
    cookies.remove('token');
    $emit('toggleLogin', false);
    $emit('toggleManager', false);
    router.push('/login');
};

const getUserInfo = () => {
    axios.get('http://localhost:5173/api/user/info', {
        headers: {
            Authorization: `${token}`
        }
    })
        .then((response) => {
            user.value = response.data.data;
        })
        .catch((error) => {
            console.error(error);
        });
};

let updateMode = ref(false);
let tempUser = ref(user.value);

const toggleUpdateMode = () => {
    updateMode.value = !updateMode.value;
};

const updateUserInfo = () => {
    updateMode.value = false;
    console.log(user.value);
    axios.put('http://localhost:5173/api/user/info', {}, {
        headers: {
            Authorization: `${token}`
        },
        params: {
            password: user.value.password,
            phone_nbr: user.value.phone_nbr
        }
    })
        .then((response) => {
            alert('修改成功, 请重新登录');
            router.push('/login');
        })
        .catch((error) => {
            console.error(error);
            alert('修改失败');
        });
};

onBeforeMount(() => {
    getUserInfo();
});
</script>

<style scoped>
.table_head_text {
    margin: 0.3em;
    display: flex;
    background-color: transparent;
    justify-content: center;
}

.table_head_text p {
    color: rgb(34, 197, 94);
    background-color: transparent;
}

p {
    background-color: transparent;
    margin: 0 2em;
}

.user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

table {
    border-collapse: collapse;
}

tbody {
    tr:nth-child(2n) {
        background-color: #404840;
    }

    tr:nth-child(2n+1) {
        background-color: #405040;
    }
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

.buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

button {
    background-color: #555;
    border: none;
    padding: 0.6em;
    font-size: 0.9em;
    width: 6em;
    border-radius: 0.3rem;
    color: rgb(34, 197, 94);
    box-shadow: 0 0.1rem #222;
    cursor: pointer;
    margin: 0.8em;
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
</style>