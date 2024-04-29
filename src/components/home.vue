<template>
    <div class="user-info">
        <table>
            <tr>
            <th><p>用户名</p></th>
            <td><p>{{ user.username }}</p></td>
            </tr>
            <tr>
            <th><p>职务</p></th>
            <td><p>{{ user.role }}</p></td>
            </tr>
            <tr>
            <th><p>手机号</p></th>
            <td><p>{{ user.phone_nbr }}</p></td>
            </tr>
            <tr>
                <th><p>密码</p></th>
                <td>
                    <input v-model="user.password" v-if="updateMode" type="password"/>
                    <p v-else>******</p>
                </td>
            </tr>
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
    let $emit = defineEmits(['toggleLogin','toggleManager']);

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
    .user-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }

    button {
        border-radius: 10px;
        margin-top: 20px;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        cursor: pointer;
        width: 100px;
    }

    .buttons {
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
        justify-content: center;
    }

    button:hover {
        background-color: #45a049;
    }

    button:active {
        background-color: #3e8e41;
    }
</style>