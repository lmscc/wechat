import { createRouter, createWebHistory } from 'vue-router';
import Login from "@/pages/Login.vue";
import friendList from "@/pages/friend/FriendList.vue";
import friendMsg from "@/pages/friend/FriendMsg.vue";
import MsgList from "@/pages/msg/MsgList.vue";
import { asyncLoad } from "@/js/utils";
import postForm from "@/components/PostForm.vue";
import store from "@/store/index";
let router;
const routes = [
  {
  path: '/login',
  name: 'Login',
  component: Login
}, {
  path: '/msgList',
  name: 'msgList',
  component: MsgList
}, {
  path: '/friendList',
  name: 'friendList',
  component: friendList // component: asyncLoad(() => import(/* webpackChunkName: "afterLogin" */'@/pages/friend/FriendList.vue'))

}, {
  path: '/friendMsg/:userId',
  name: 'friendMsg',
  component: friendMsg,
  props: true
}, {
  path: '/dialog/:userId',
  name: 'dialog',
  component: asyncLoad(() => import(
  /* webpackChunkName: "afterLogin" */
  '@/pages/dialog/Dialog.vue')),
  props: true,
  beforeEnter: (to, from) => {
    store.commit('getNewMsg', {
      userId: to.params.userId,
      value: false
    });
  }
}, {
  path: '/self',
  name: 'self',
  component: asyncLoad(() => import(
  /* webpackChunkName: "afterLogin" */
  '@/pages/self/Self.vue'))
}, {
  path: '/selfMsg',
  name: 'selfMsg',
  component: asyncLoad(() => import(
  /* webpackChunkName: "afterLogin" */
  '@/pages/self/SelfMsg.vue')) // children:[
  //     {
  //         path:'detail/:type',
  //         name:'detail',
  //         component:asyncLoad(() => import(/* webpackChunkName: "afterLogin" */'@/components/SelfMsgDetail.vue')),
  //         props:true
  //     }
  // ]

}, {
  path: '/postForm/:type/:userId',
  name: 'postForm',
  component: postForm,
  // component:asyncLoad(() => import(/* webpackChunkName: "afterLogin" */'@/components/PostForm.vue')),
  props: true
}, {
  path: '/search',
  name: 'Search',
  component: asyncLoad(() => import(
  /* webpackChunkName: "afterLogin" */
  '@/pages/Search.vue'))
}, {
  path: '/addFriend/:userId',
  name: 'FriendApplyFor',
  component: asyncLoad(() => import(
  /* webpackChunkName: "afterLogin" */
  '@/pages/friend/FriendApplyFor.vue')),
  props: true
}, {
  path: '/newFriends',
  name: 'newFriends',
  component: asyncLoad(() => import(
  /* webpackChunkName: "afterLogin" */
  '@/pages/friend/FriendNew.vue'))
}
];
router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});
export default router;