<template>
    <div>
        <form @submit.prevent="addUser">
            <input type="text" v-model="newUser.username" placeholder="username" required>
            <input type="password" v-model="newUser.password" placeholder="password" required>
            <button type="submit">新增</button>
        </form>
        <table class="user_management_table">
            <thead>
                <tr>
                    <th><span>用户ID</span></th>
                    <th><span>用户名</span></th>
                    <th><span>职务</span></th>
                    <th><span>密码</span></th>
                    <th><span>手机</span></th>
                    <th><span>创建时间</span></th>
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
                    <td><span></span></td>
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
import { useRouter } from 'vue-router';
import { onMounted, onBeforeUnmount } from 'vue';
import { format } from 'date-fns';
import { defineEmits } from 'vue';
import { defineProps } from 'vue';
import userEditDialog from '@/dialogs/userEditDialog.vue';

const { cookies } = useCookies();
const router = useRouter();
let $emit = defineEmits(['toggleLogin', 'toggleManager']);

const formattedDate = (date:Date) => {
      return format(date, 'yyyy-MM-dd');
    };

const logout = () => {
    cookies.remove('token');
    $emit('toggleLogin', false);
    $emit('toggleManager', false);
    router.push('/login');
};

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
const toggleAddMode = ref(false);//TODO: add mode

// Fetch users from the server
const fetchUsers = async () => {
    try {
        const response = await axios.get('http://localhost:5173/api/user/all', {
            headers: {
                Authorization: `${cookies.get('token')}`
            }
        });
        users.value = response.data.data;
        if (response.data.code !== 200) {
            alert('获取用户失败');
            logout();
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        logout();
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
    
};

const deleteUser = async (user: User) => {
    await axios.delete('http://localhost:5173/api/user', {
        headers: {
            Authorization: `${cookies.get('token')}`
        },
        params: {
            id: user.id
        }
    }).then((response) => {
        if (response.data.code !== 200) {
            alert('删除用户失败');
            return;
        }
        console.log('User deleted:', user);
        alert('删除用户成功');
        fetchUsers();
    }).catch((error) => {
        console.error('Error deleting user:', error);
    });
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

.user_management_table {
    border-collapse: collapse;
    width: 50vw;
}

tbody {
    tr:nth-child(2n) {
        background-color: #404840;
    }

    tr:nth-child(2n+1) {
        background-color: #405040;
    }
}
</style>