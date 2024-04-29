<template>
    <el-dialog :model-value="visible" title="账号和密码" @close="handleClose">
        <!-- 省略账号、密码表单部分... -->
        <el-button type="primary" @click="submitForm()">提交</el-button>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";

interface UserData {
    username: string;
    password: string;
    phone_nbr: number;
    role: string;
}

const data = ref<UserData>({
    username: "",
    password: "",
    phone_nbr: NaN,
    role: "",
});

interface Props {
    visible: boolean;
    close?: () => void;
    confirm?: (data:UserData) => void;
}

const props = defineProps<Props>();

const emit = defineEmits(["update:visible"]);

const submitForm = async () => {
    // 省略validate表单校验的代码
    // 这里的data为表单中输入的账号密码
    props.confirm?.(data.value);
    handleClose();
};

const handleClose = () => {
    emit("update:visible", false);
    props.close?.();
};
</script>