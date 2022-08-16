import Home from "@/pages/Home.vue";
import Login from "@/pages/Login.vue";

const routes = [
    {
        //这里需要将根目录默认为Home，方便实现用户在保持登录 状态下再次登录时直接跳转至主页面
        path: "/",
        redirect: {
            name: "Home"
        },
        meta: {
            auth: true
        }
    },
    {
        path: "/home",
        name: "Home",
        component: Home,
        meta: {
            auth: true
        }
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
        meta: {
            auth: false
        }
    }
    , {
        path: "/register",
        name: "Register",
        component: () =>
            import("@/pages/Register.vue"),
        meta: {
            auth: false
        }
    }
];

export default routes