<template>
    <div class="dialog">
        <h2>{{ title }}</h2>
        <form @submit.prevent>
            <div class="wave-group">
                <input type="text" class="input" v-model="data.username" required>
                <span class="bar"></span>
                <label class="label">
                    <span class="label-char" style="--index: 0">用</span>
                    <span class="label-char" style="--index: 1">户</span>
                    <span class="label-char" style="--index: 2">名</span>
                </label>
            </div>
            <div class="wave-group">
                <input type="password" class="input" v-model="data.password" required>
                <span class="bar"></span>
                <label class="label">
                    <span class="label-char" style="--index: 0">密</span>
                    <span class="label-char" style="--index: 1">码</span>
                </label>
            </div>
            <div class="wave-group">
                <input type="number" class="input" v-model="data.phone_nbr" required>
                <span class="bar"></span>
                <label class="label">
                    <span class="label-char" style="--index: 0">手</span>
                    <span class="label-char" style="--index: 1">机</span>
                </label>
            </div>
            <div class="radio-inputs">
                <label class="radio">
                    <input type="radio" name="radio" v-model="data.role" :value="Role.Manager">
                    <span class="name">Manager</span>
                </label>
                <label class="radio">
                    <input type="radio" name="radio" v-model="data.role" :value="Role.Emploee">
                    <span class="name">Emploee</span>
                </label>
            </div>
            <div>
                <button type="submit" class="animated-button" @click="submitForm">
                    <span class="button_name">确认</span>
                    <span></span>
                </button>
                <button type="button" class="animated-button" @click="$emit('close', false)">
                    <span class="button_name">取消</span>
                    <span></span>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from "vue";
import type { User } from "@/assets/types";
import { Role } from "@/assets/types";

interface UserData {
    id: number;
    username: string;
    password: string;
    phone_nbr: number;
    role: Role;
}

const $emit = defineEmits(["close", "confirm", "upload"]);

const title = ref<string>("");

const data = ref<UserData>({
    id: 0,
    username: "",
    password: "",
    phone_nbr: NaN,
    role: Role.Manager,
});

const props = defineProps<{
    user: User | null;
    editMode: boolean;
}>();

const initDialog = () => {
    if (props.editMode) {
        if (props.user === null) {
            throw new Error("User is null");
        } else {
            title.value = "编辑用户";
            initEditData();
        }
    }else {
        title.value = "新增用户";
    }
};

const initEditData = () => {
    if (props.user !== null) {
        data.value.id = props.user.id;
        data.value.username = props.user.username;
        data.value.password = props.user.password;
        data.value.phone_nbr = props.user.phone_nbr;
        if (props.user.role === Role.Manager) {
            data.value.role = Role.Manager;
        } else {
            data.value.role = Role.Emploee;
        }
    } else {
        throw new Error("User is null");
    };
};

const submitForm = async () => {
    if (data.value.username === "" || data.value.password === "" || data.value.phone_nbr <10000000000) {
        alert("请填写完整信息");
        return;
    }
    if (props.editMode) {
        $emit("confirm", data.value);
        $emit("close");
        return;
    }
    $emit("upload", data.value);
    $emit("close");
};

initDialog();
</script>

<style scoped>
button {
    margin: 1.4em;
}

h2 {
    background: transparent;
}

.dialog {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: transparent;
}

form {
    margin-top: 2em;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.radio-inputs {
    margin-top: 1em;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    border-radius: 0.5rem;
    background-color: #444;
    box-sizing: border-box;
    box-shadow: 0 0 0px 1px rgba(0, 0, 0, 0.06);
    padding: 0.25rem;
    width: 15em;
    font-size: 14px;
}

.radio-inputs .radio {
    flex: 1 1 auto;
    text-align: center;
}

.radio-inputs .radio input {
    display: none;
}

.radio-inputs .radio .name {
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    border: none;
    padding: .5rem 0;
    color: #9c9;
    transition: all .15s ease-in-out;
    background-color: #444;
}

.radio-inputs .radio input:checked+.name {
    background-color: #777;
    font-weight: 600;
}

.wave-group {
    position: relative;
    margin: 0.5em;
    background: transparent;
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

.animated-button {
    position: relative;
    display: inline-block;
    padding: 0.7em 1.3em;
    border: none;
    font-size: 1em;
    background-color: inherit;
    border-radius: 100px;
    font-weight: 600;
    color: #ffffff40;
    box-shadow: 0 0 0 2px #ffffff20;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
}

.animated-button span:last-child {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    background-color: rgb(34, 197, 94);
    border-radius: 50%;
    opacity: 0;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.320, 1);
}

.animated-button span:first-child {
    position: relative;
    z-index: 1;
    background-color: transparent;
}

.animated-button:hover {
    box-shadow: 0 0 0 5px rgb(17, 98, 47);
    color: #ffffff;
}

.animated-button:active {
    scale: 0.95;
}

.animated-button:hover span:last-child {
    width: 150px;
    height: 150px;
    opacity: 1;
}

input[type="password"]::-ms-reveal {
    display: none
}

input[type=number] {

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
}
</style>