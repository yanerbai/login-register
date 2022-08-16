import Vue from "vue";
import VueRouter from "vue-router";
import { Message } from 'element-ui';
import store from "@/store";


import routes from "./router"
// 解决：vue-router路由版本更新产生的问题,导致路由跳转失败抛出错误
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject)
        return originalPush.call(this, location, onResolve, onReject);
    return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes
});

router.beforeEach((to, from, next) => {
    // isAuth为true记住登录状态
    let token = store.state.token
    if (to.meta.auth) {
        if (token == 'true') {
            next()
        } else {
            next({
                path: '/login'
            })
            Message.warning("暂未登录，即将前往登录");
        }
    } else {
        next()
    }
})

export default router;

