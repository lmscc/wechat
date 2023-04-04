<template>
    <router-view v-slot="{ Component }">
        <keep-alive exclude="postForm,Search," ref="alive">
            <component :is="Component" />
        </keep-alive>
        <!-- <component :is="Component" v-if='isLoginExit' /> -->
    </router-view>
    <Footer v-if="isFooterExist" />
    <ShowImg />
</template>

<script>
import { computed, onBeforeMount, onMounted, watchEffect, ref } from "vue";
import router from "@/router";
import Footer from "@/components/Footer.vue";
import ShowImg from "@/components/ShowImg.vue";
import change from "@/js/suoyin";
window.change = change;
export default {
    components: {
        Footer,
        ShowImg,
    },

    setup() {
        onBeforeMount(() => {
            router.push("/login");
        });
        const alive = ref();
        onMounted(() => {
            watchEffect(() => {
                if (router.currentRoute.value.fullPath == "/login") {
                    alive.value._.__v_cache.clear();
                }
            });
        });
        // let isLoginExit = computed(() => router.currentRoute.value.fullPath == '/login');
        let isFooterExist = computed(() =>
            /friendList|msgList|self/.test(router.currentRoute.value.fullPath)
        );
        return {
            // isLoginExit,
            isFooterExist, // dataList,clickItem
            alive,
        };
    },
};
</script>

<style lang='stylus'>
bottom_height = 52px;
top_height = 50px;

* {
    margin: 0;
    padding: 0;
}

html, body {
    width: 100%;
    height: 100%;
    position: fixed;
    font-family: sans-serif;
    font-weight: normal;
    background: black;
}

input {
    -webkit-user-select: auto;
    -moz-user-select: auto;
}

#app {
    position: relative;
    height: 100%;
    width: 100%;
    margin: 0 auto;
    background: white;

    .main_part {
        position: absolute;
        top: top_height;
        bottom: bottom_height;
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .main_part_2 {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        background: white;
        box-sizing: border-box;
        z-index: 1;
    }

    .card {
        display: flex;
        padding-left: 15px;
        background: white;
        padding-top: 10px;
        padding-bottom: 12px;
        align-items: center;

        .avatar {
            width: 70px;
            height: 70px;
        }

        .msg {
            margin-left: 12px;
            flex-grow: 1;

            .name {
                font-size: 25px;
                font-weight: 500;
                margin-bottom: 5px;
            }

            .small_msg {
                color: rgba(0, 0, 0, 0.9);
                font-size: 14px;
            }
        }
    }
}

img {
    object-fit: cover;
}

// ::-webkit-scrollbar {
// width: 4px;
// height: 4px;
// }
* {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

@media screen and (min-width: 375px) {
    body {
        display: flex;
        align-items: center;

        &:after {
            content: '';
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            background: url('./assets/back.webp');
            background-size: 100% 100%;
            filter: blur(2px);
            z-index: -1;
        }
    }

    #app {
        border-radius: 5px;
        overflow: hidden;
        width: 375px;
        height: 660px;
    }
}
</style> 