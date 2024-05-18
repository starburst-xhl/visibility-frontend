<template>
    <div>
        <div class="photo_management_header">
            <h2>照片管理</h2>
            <button v-if="props.isManager" @click="dispense" style="width: fit-content;">分配审核员</button>
            <button v-if="props.isManager" @click="dispense" style="width: fit-content;">导出数据</button>
        </div>
        <div class="search-filters">
            <div class="wave-group">
                <input type="text" class="input" v-model="state.searchLocation" />
                <span class="bar"></span>
                <label class="label">
                    <span class="label-char" style="--index: 0">地</span>
                    <span class="label-char" style="--index: 1">点</span>
                </label>
            </div>
            <div class="wave-group">
                <input type="text" class="input" v-model="state.searchUsername" />
                <span class="bar"></span>
                <label class="label">
                    <span class="label-char" style="--index: 0">用</span>
                    <span class="label-char" style="--index: 1">户</span>
                    <span class="label-char" style="--index: 2">名</span>
                </label>
            </div>
            <select v-model="state.filterStatus">
                <option value=4>全部</option>
                <option value=0>待审核</option>
                <option value=1>已审核</option>
                <option value=2>二审中</option>
                <option value=3>已二审</option>
            </select>
        </div>
        <div class="photo_management_table_container">
            <table class="photo_management_table">
                <thead>
                    <tr>
                        <th><span>拍摄时间</span></th>
                        <th><span>地点</span></th>
                        <th><span>探测器能见度</span></th>
                        <th><span>审核员</span></th>
                        <th><span>审核状态</span></th>
                        <th><span>最终能见度</span></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="photoStatus in currentPageData" :key="photoStatus.id">
                        <td><span>{{ formattedDate(photoStatus.date) }}</span></td>
                        <td><span>{{ photoStatus.location }}</span></td>
                        <td><span>{{ photoStatus.visibility }}</span></td>
                        <td><span>{{ photoStatus.username ? photoStatus.username : "未分配" }}</span></td>
                        <td><span>{{ transportCheckStatus(photoStatus.status) }}</span></td>
                        <td><span>{{ (photoStatus.status === 1 || photoStatus.status === 3)
                            ? photoStatus.new_visibility : "" }}</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
            <span>页码: {{ currentPage }} / {{ totalPages }}</span>
            <input class="page_input" type="number" v-model.number="inputPage" min="1" :max="totalPages"
                @keyup.enter="goToPage" />
            <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import axios from 'axios'
import { useCookies } from 'vue3-cookies'
import type { Photo, PhotoStatus } from '@/assets/types';
import { format } from 'date-fns';
import { pa } from 'element-plus/es/locales.mjs';

const { cookies } = useCookies()
const data = ref<Array<PhotoStatus>>([]);
let currentPage = ref(1);
let inputPage = ref(1);
const reversed = ref(false);
const pageSize = 10;
const totalPages = computed(() => Math.ceil(filteredPhotos.value.length / pageSize));
const state = reactive({
    searchLocation: '',
    searchUsername: '',
    filterStatus: 4,
});
const props = defineProps(['isManager']);

const filteredPhotos = computed(() => {
    return data.value.filter(photo => {
        return photo.location.includes(state.searchLocation) &&
            issearchuser(photo) &&
            (state.filterStatus == 4 || photo.status == state.filterStatus);
    });
});

const issearchuser = (photo: PhotoStatus) => {
    if (state.searchUsername === '') {
        return true;
    }
    return photo.username.includes(state.searchUsername);
};

const currentPageData = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    const end = start + pageSize;
    return filteredPhotos.value.slice(start, end);
});

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

const goToPage = () => {
    if (inputPage.value >= 1 && inputPage.value <= totalPages.value) {
        currentPage.value = inputPage.value;
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

const formattedDate = (date: Date) => {
    return format(date, 'yyyy-MM-dd HH:mm:ss');
};

const transportCheckStatus = (status: number) => {
    if (status === 0) {
        return "未审核";
    }
    if (status === 1) {
        return "已审核";
    }
    if (status === 2) {
        return "二审中";
    }
    if (status === 3) {
        return "已二审";
    }
};

const getData = async () => {
    await axios.get('http://localhost:5173/api/photo/all', {
        headers: {
            Authorization: `${cookies.get('token')}`,
        },
    }).then((response) => {
        data.value = response.data;
        data.value = data.value.reverse();
    }).catch((error) => {
        console.log(error);
    });
};

const dispense = async () => {
    await axios.get('http://localhost:5173/api/photo/dispense', {
        headers: {
            Authorization: `${cookies.get('token')}`,
        },
        params: {
            resolution: "order"
        },
    }).then((response) => {
        console.log(response);
        if (response.data.code === 200) {
            alert('分配成功');
        } else {
            alert('分配失败');
        }
    }).catch((error) => {
        console.log(error);
        alert('分配失败');
    });
};

getData();
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

.photo_management_table {
    border-collapse: collapse;
    width: 50vw;
}

.photo_management_table_container {
    width: fit-content;
    max-height: 50vh;
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

.photo_management_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1em;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
}

.search-filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1em;
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

.page_input {
    width: 3em;
    margin: 0 0.5em;
    background-color: #555;
    border: none;
    color: #eee;
    outline: none;
    border-radius: 3px;
    margin-top: 3px;
}

input[type=number] {

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
}
</style>