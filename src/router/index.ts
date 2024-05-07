import { createRouter,createMemoryHistory } from "vue-router";

import login from "../components/login.vue";
import home from "../components/home.vue";
import manage from "../components/manage.vue";
import myChart from "@/components/myChart.vue";

const router = createRouter({
    history: createMemoryHistory(),
    routes: [
        { path: "/login", component: login },
        { path: "/home", component: home},
        { path: "/", redirect: "/login"},
        { path: "/manage",component: manage},
        { path: "/chart",component: myChart}
    ],
});

export default router;