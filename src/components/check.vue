<template>
    <div class="check_view_container">
        <div>
            <h2>图片审核</h2>
        </div>
        <div id="image_container">
            <img id="image" v-if="image_display" :src="image_blob" alt="Image to be reviewed" class="fade" />
            <div v-else class="loader"></div>
        </div>
        <div class="image_info_table">
            <table>
                <thead>
                    <tr>
                        <td>
                            <p>能见度：</p>
                        </td>
                        <td>
                            <p>地点：</p>
                        </td>
                        <td>
                            <p>时间：</p>
                        </td>
                        <td>
                            <p>剩余张数：</p>
                        </td>
                        <td>
                            <p>操作：</p>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <p>{{ currentPageData?.visibility }}</p>
                        </td>
                        <td>
                            <p>{{ currentPageData?.location }}</p>
                        </td>
                        <td>
                            <p>{{ formattedDate }}</p>
                        </td>
                        <td>
                            <p>{{ pagesLast }}</p>
                        </td>
                        <td>
                            <button @click="pass">通过</button>
                            <button @click="doubleCheck">复审</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import type { Photo } from '@/assets/types';
import { useCookies } from 'vue3-cookies';
import { useRouter } from 'vue-router';
import { format } from 'date-fns';

const image_display = ref(false);
const currentPageData = ref<Photo>();
const photos = ref<Photo[]>([]);
const pagesLast = computed(() => photos.value.length);
let { cookies } = useCookies();
const image_blob = ref();
const router = useRouter();
const props = defineProps(['isManager']);
const formattedDate = computed(() => {
    return format(currentPageData.value?.date || new Date(), 'yyyy-MM-dd HH:mm:ss')
});

const nextPage = () => {
    if (photos.value.length === 0) {
        alert('没有图片了');
        return;
    }
    currentPageData.value = photos.value.pop();
    image_display.value = false;
    getImage();
};

const getPhotos = async () => {
    await axios.get('http://localhost:5173/api/photo/getPhotos', {
        headers: {
            Authorization: `${cookies.get('token')}`,
        },
    }).then((response) => {
        photos.value = response.data;
        photos.value.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        if (photos.value.length === 0) {
            alert('没有图片了');
            router.push('/chart');
        }
        nextPage();
    }).catch((error) => {
        console.log(error);
    });
};

const getImage = async () => {
    const photo = currentPageData.value;
    if (photo === undefined) {
        alert('图片未定义');
        return;
    }
    await axios.get('http://localhost:5173/api/photo/image', {
        params: {
            id: photo.id,
        },
        headers: {
            Authorization: `${cookies.get('token')}`,
        },
        responseType: 'blob',
    }).then((response) => {
        const blob = new Blob([response.data], { type: 'image/jpeg' });
        const imageUrl = URL.createObjectURL(blob);
        image_blob.value = imageUrl;
        image_display.value = true;
    }).catch((error) => {
        console.log(error);
    });
};

const pass = async () => {
    if (pagesLast.value === 0) {
        alert('没有图片了');
        return;
    }
    if (currentPageData.value === undefined) {
        alert('图片加载中');
        return;
    }
    await axios.post('http://localhost:5173/api/photo/pass', {}, {
        params: {
            id: currentPageData.value.id,
        },
        headers: {
            Authorization: `${cookies.get('token')}`,
        },
    }).then((response) => {
        if (response.data.code === 200) {
            nextPage();
        } else {
            alert('上传失败');
        }
    }).catch((error) => {
        console.log(error);
        alert('上传失败');
    });
};

const doubleCheck = async () => {
    if (pagesLast.value === 0) {
        alert('没有图片了');
        return;
    }
    if (currentPageData.value === undefined) {
        alert('图片加载中');
        return;
    }
    await axios.post('http://localhost:5173/api/photo/doubleCheck', {},{
        params: {
            id: currentPageData.value.id,
        },
        headers: {
            Authorization: `${cookies.get('token')}`,
        },
    }).then((response) => {
        console.log(response);
        if (response.data.code === 200) {
            nextPage();
        } else {
            alert('上传失败');
        }
    }).catch((error) => {
        console.log(error);
        alert('上传失败');
    });
};

getPhotos();
</script>

<style scoped>
.loader {
    width: 60px;
    height: 60px;
    border: 10px solid #1cd42550;
    border-top-color: #1cd425;
    animation: spin013151 1s linear infinite;
    border-radius: 100%;
}

@keyframes spin013151 {
    to {
        transform: rotate(360deg);
    }
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

#image_container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 457px;
    width: 805px;
    margin: 0 auto;
    background-color: #7778;
    border-radius: 5px;
    padding: 7px;
}

#image {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

table {
    border-collapse: collapse;
    margin: 0.7em;
    width: 800px;
    border-radius: 5px;
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
    padding-right: 30px;
    min-width: 130px;
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
    background-color: transparent;
}

.image_info_table {
    display: flex;
    justify-content: center;
    align-items: center;

}

.fade {
    -webkit-animation-name: fade;
    -webkit-animation-duration: 1.5s;
    animation-name: fade;
    animation-duration: 1.5s;
}

@-webkit-keyframes fade {
    from {
        opacity: .4
    }

    to {
        opacity: 1
    }
}

@keyframes fade {
    from {
        opacity: .4
    }

    to {
        opacity: 1
    }
}
</style>