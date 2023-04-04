import { createApp } from 'vue';
import App from "@/App.vue";
import lazyPlugin from '@/js/lazyDirective';

import router from "@/router";
import store from "@/store";
import "@/js/captrue";
import { Button, Icon, Avatar, Input, Notify, Tabbar, TabbarItem, Navbar, Uploader, Progress, Popup, OverLay, Popover, Swiper, SwiperItem, Video, CircleProgress, Elevator } from "@nutui/nutui";
import "@nutui/nutui/dist/style.css";

const vm = createApp(App)
// vm.use(lazyPlugin, {
//   // loading: require('./assets/loading.gif'),
//   // // 图片加载时默认图片
//   // error: require('./assets/error.png') // 图片加载失败时默认图片

// });
vm.use(lazyPlugin,{
  loading:require('./assets/loading.gif'),
  error:require('./assets/error.png'),
  avatar:require('./assets/head.svg')
})
vm.use(Button).use(Icon).use(Avatar).use(Input).use(Tabbar).use(TabbarItem).use(Navbar).use(Uploader).use(Progress).use(CircleProgress).use(Elevator).use(Notify).use(Popup).use(OverLay).use(Popover).use(Swiper).use(SwiperItem).use(Video); // import NutUI from "@nutui/nutui";

vm.use(router).use(store);

vm.mount('#app');