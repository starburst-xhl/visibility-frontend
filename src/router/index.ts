import { createRouter,createMemoryHistory } from "vue-router";

import login from "../components/login.vue";
import home from "../components/home.vue";
import manage from "../components/manage.vue";
import myChart from "@/components/chart.vue";
import photoManage from "@/components/photoManage.vue";
import check from "@/components/check.vue";

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
    ],
});

export default router;