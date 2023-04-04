import Load from "@/components/common/Load.vue";
import Err from "@/components/common/Error.vue";
import { defineAsyncComponent,nextTick } from 'vue';
import router from "@/router";
import { clearStore } from "@/store/handleStore";
import { Notify } from '@nutui/nutui';

export function asyncLoad(fn, isComponent) {
  let obj = {
    loader: fn,
    // 加载异步组件时要使用的组件
    loadingComponent: Load,
    // 加载失败时要使用的组件
    errorComponent: Err,
    // 在显示 loadingComponent 之前的延迟 | 默认值：200（单位 ms）
    delay: 1000,
    // 如果提供了 timeout ，并且加载组件的时间超过了设定值，将显示错误组件
    // 默认值：Infinity（即永不超时，单位 ms）
    timeout: 3000
  };
  return isComponent ? defineAsyncComponent(obj) : fn;
}
export function keepBottom() {
  let dom = document.querySelector('.msg_wrap');

  // if (dom) {
  //   setTimeout(() => {
  //     dom.scrollTop = dom.scrollHeight + 50;
  //   }, 0);
  // }
  // if(window.bscroll)
  // setTimeout(() => {
  //   bscroll.refresh()
  //   bscroll.scrollTo(0,bscroll.maxScrollY)
  // }, 0);
    
}

export function logout(type, msg) {
  if (type == 0) {
    Notify.success(msg);
  } else if (type == 1) {
    Notify.warn(msg);
  }

  router.push('/login'); //使用宏任务，可以先销毁组件，防止改变store.state触发组件的变化，而报错
  nextTick(()=>{
    clearStore();
  })
} 
// export function asyncLoad(path) {
//     return defineAsyncComponent({
//         loader: () => import(/* webpackChunkName: "friendList" */path),
//         // 加载异步组件时要使用的组件
//         loadingComponent: Load,
//         // 加载失败时要使用的组件
//         errorComponent: Err,
//         // 在显示 loadingComponent 之前的延迟 | 默认值：200（单位 ms）
//         delay: 1000,
//         // 如果提供了 timeout ，并且加载组件的时间超过了设定值，将显示错误组件
//         // 默认值：Infinity（即永不超时，单位 ms）
//         timeout: 3000
//     }) 
// }