import { createRouter,createMemoryHistory } from "vue-router";

import login from "../components/login.vue";
import home from "../components/home.vue";
import manage from "../components/manage.vue";
import myChart from "@/components/chart.vue";
import photoManage from "@/components/photoManage.vue";
import check from "@/components/check.vue";
import logs from "@/components/logs.vue";
import doubleCheck from "@/components/doubleCheck.vue";
import chat from "@/components/chat.vue";
import upload from "@/components/upload.vue";
import userSelect from "@/components/userSelect.vue";

const router = createRouter({
    history: createMemoryHistory(),
    routes: [
        { path: "/login", component: login },
        { path: "/home", component: home},
        { path: "/", redirect: "/login"},
        { path: "/manage",component: manage},
        { path: "/chart",component: myChart},
        { path: "/photoManage",component: photoManage},
        { path: "/check",component: check},
        { path: "/logs",component: logs},
        { path: "/doubleCheck",component: doubleCheck},
        { path: "/chat",component: chat},
        { path: "/upload",component: upload},
        { path: "/userSelect",component: userSelect},
    ],
});

export default router;