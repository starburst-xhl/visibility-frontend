<template>
    <div>
        <div class="user_management_header">
            <h2>用户管理</h2>
            <button @click="addUserMode" type="button">新增</button>
        </div>
        <div class="user_management_table_container">
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
                        <td><span>{{ formattedDate(user.create_at) }}</span></td>
                        <td>
                            <button @click="editUser(user)">编辑</button>
                            <button @click="deleteUser(user)">删除</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="edit_dialog" v-if="addMode || editMode">
        <userEditDialog @close="closeDialog" @confirm="updateUser" @upload="addUser" :user="userInEdit"
            :editMode="editMode" />
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
import userEditDialog from '@/dialogs/userEditDialog.vue';
import type { User } from '@/assets/types';

let arr: User[] = []
const users = ref(arr);
const addMode = ref(false);
const editMode = ref(false);
const { cookies } = useCookies();
const router = useRouter();
let $emit = defineEmits(['toggleLogin', 'toggleManager']);
let userInEdit = ref<User | null>({
    id: NaN,
    username: '',
    password: '',
    phone_nbr: NaN,
    role: '',
    create_at: new Date()
});

const formattedDate = (date: Date) => {
    return format(date, 'yyyy-MM-dd');
};

const closeDialog = () => {
    toggleEditMode(false);
    toggleAddMode(false);
};

const toggleAddMode = (mode: boolean) => {
    addMode.value = mode;
};

const toggleEditMode = (mode: boolean) => {
    editMode.value = mode;
};

const logout = () => {
    cookies.remove('token');
    $emit('toggleLogin', false);
    $emit('toggleManager', false);
    router.push('/login');
};

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

const editUser = (user: User) => {
    toggleEditMode(true);
    userInEdit.value = user;
};

const addUserMode = () => {
    toggleAddMode(true);
};

const updateUser = async (user: User) => {
    await axios.put('http://localhost:5173/api/user', {}, {
        headers: {
            Authorization: `${cookies.get('token')}`
        },
        params: {
            id: user.id,
            username: user.username,
            password: user.password,
            phone_nbr: user.phone_nbr,
            role: user.role
        }
    }).then((response) => {
        if (response.data.code !== 200) {
            alert('编辑用户失败');
            logout();
            return;
        }
        console.log('User updated:', user);
        alert('编辑用户成功');
        fetchUsers();
    }).catch((error) => {
        alert('编辑用户失败');
        console.error('Error updating user:', error);
        logout();
    });
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
            logout();
            return;
        }
        console.log('User deleted:', user);
        alert('删除用户成功');
        fetchUsers();
    }).catch((error) => {
        alert('删除用户失败');
        console.error('Error deleting user:', error);
        logout();
    });
};

const addUser = async (user: User) => {
    await axios.post('http://localhost:5173/api/user', {}, {
        headers: {
            Authorization: `${cookies.get('token')}`
        },
        params: {
            username: user.username,
            password: user.password,
            phone_nbr: user.phone_nbr,
            role: user.role
        }
    }).then((response) => {
        if (response.data.code !== 200) {
            alert('添加用户失败');
            logout();
            return;
        }
        console.log('User added:', user);
        alert('添加用户成功');
        fetchUsers();
    }).catch((error) => {
        alert('添加用户失败');
        console.error('Error adding user:', error);
        logout();
    });
};
</script>

<style scoped>
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

.user_management_table_container {
    width: fit-content;
    max-height: 50vh;
    overflow-y: auto;
}

tbody {
    tr:nth-child(2n) {
        background-color: #404840;
    }

    tr:nth-child(2n+1) {
        background-color: #405040;
    }
}

.edit_dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 22em;
    height: 28em;
    margin-left: -11em;
    margin-top: -14em;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #333d;
    border: #555 solid 0.1em;
    box-shadow: 0.5em 0.5em 0.2em #282828;
    border-radius: 0.5em;
}

.user_management_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1em;
}
</style>