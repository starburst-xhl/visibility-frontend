<template>
    <div>
        <form @submit.prevent="addUser">
            <input type="text" v-model="newUser.username" placeholder="username" required>
            <input type="password" v-model="newUser.password" placeholder="password" required>
            <button type="submit">新增</button>
        </form>
        <table>
            <thead>
                <tr>
                    <th><span>ID</span></th>
                    <th><span>用户名</span></th>
                    <th><span>职务</span></th>
                    <th><span>密码</span></th>
                    <th><span>手机</span></th>
                    <th><span>操作</span></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id">
                    <td><span>{{ user.id }}</span></td>
                    <td><span>{{ user.username }}</span></td>
                    <td><span>{{ user.role }}</span></td>
                    <td><span>{{ user.password }}</span></td>
                    <td><span>{{ user.phone_nbr }}</span></td>
                    <td>
                        <button @click="editUser(user)">编辑</button>
                        <button @click="deleteUser(user)">删除</button>
                    </td>
                </tr>
            </tbody>
        </table>

    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import axios from 'axios';
import { useCookies } from 'vue3-cookies';

import { onMounted, onBeforeUnmount } from 'vue';



interface User {
    id: number;
    username: string;
    password: string;
    phone_nbr: number;
    role: string;
    create_at: Date;
}

let arr: User[] = []
const users = ref(arr);
const { cookies } = useCookies();
const toggleAddMode = ref(false);

// Fetch users from the server
const fetchUsers = async () => {
    try {
        const response = await axios.get('http://localhost:5173/api/user/all', {
            headers: {
                Authorization: `${cookies.get('token')}`
            }
        });
        users.value = response.data.data;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

// Fetch users when the component is mounted
onMounted(() => {
    fetchUsers();
});

// Fetch users when the route changes
const routeChangeHandler = () => {
    fetchUsers();
};

// Register route change listener
onBeforeUnmount(() => {
    window.removeEventListener('popstate', routeChangeHandler);
});

window.addEventListener('popstate', routeChangeHandler);

const newUser = reactive({
    username: '',
    password: '',
    phone_nbr: 0,
});

const editUser = (user: User) => {
    // Implement edit user logic here
    console.log('Editing user:', user);
};

const deleteUser = (user: User) => {
    // Implement delete user logic here
    console.log('Deleting user:', user);
};

const addUser = () => {
    // Implement add user logic here
    console.log('Adding user:', newUser);
    // Clear the form fields after adding the user
    newUser.username = '';
    newUser.phone_nbr = NaN;
    newUser.password = '';
};

</script>

<style scoped>
button {
    background-color: #555;
    border: none;
    padding: 0.3rem;
    font-size: 0.5rem;
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

td {
    padding: 0.5rem;
}

th span {
    color: rgb(34, 197, 94);
}

th {
    padding: 0.5rem;
}

thead {
    border-color: aliceblue;
}
</style>
