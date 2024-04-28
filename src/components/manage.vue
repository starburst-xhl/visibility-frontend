<template>
    <div>
        <h1>User Management</h1>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>username</th>
                    <th>password</th>
                    <th>phone_nbr</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id">
                    <td>{{ user.id }}</td>
                    <td>{{ user.username }}</td>
                    <td>{{ user.password }}</td>
                    <td>{{ user.phone_nbr }}</td>
                    <td>
                        <button @click="editUser(user)">Edit</button>
                        <button @click="deleteUser(user)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <form @submit.prevent="addUser">
            <input type="text" v-model="newUser.username" placeholder="username" required>
            <input type="password" v-model="newUser.password" placeholder="password" required>
            <button type="submit">Add User</button>
        </form>
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

// Fetch users from the server
const fetchUsers = async () => {
    try {
        const response = await axios.get('http://localhost:5173/api/user/all',{
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

<style>
/* Add your custom styles here */
</style>
