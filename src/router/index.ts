import { createRouter,createMemoryHistory } from "vue-router";

import login from "../components/login.vue";
import home from "../components/home.vue";

const router = createRouter({
    history: createMemoryHistory(),
    routes: [
        { path: "/login", component: login },
        { path: "/home", component: home},
    ],
});

export default router;