import { createRouter,createMemoryHistory } from "vue-router";

import login from "../components/login.vue";
import home from "../components/home.vue";
import manage from "../components/manage.vue";

const router = createRouter({
    history: createMemoryHistory(),
    routes: [
        { path: "/login", component: login },
        { path: "/home", component: home},
        { path: "/", redirect: "/login"},
        { path: "/manage",component: manage}
    ],
});

export default router;