<template>
    <div class="main_part">
        <div class="card" @click="$router.push('/selfMsg')" v-if="selfMsg">
            <img
                v-lazy="[selfMsg.avatar, 'avatar']"
                class="avatar"
                data-self="true"
            />
            <div class="msg">
                <div class="name">{{ selfMsg.name }}</div>
                <div class="small_msg">微聊号:{{ selfMsg.userId }}</div>
            </div>
            <nut-icon name="arrow-right"></nut-icon>
        </div>
        <nut-button type="primary" class="wide_btn" @click="getout" plain block
            >退出</nut-button
        >
    </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { getLogout } from "@/js/ajax";
import { logout } from "@/js/utils";
import { clearStore } from "@/store/handleStore";
export default {
    setup() {
        let store = useStore();

        function getout() {
            clearStore();
            getLogout().then((data) => {
                if (data.code == 1) {
                    logout(0, "退出成功");
                }
            });
        }

        return {
            selfMsg: computed(() => store.state.selfMsg),
            getout,
        };
    },
};
</script>

<style lang='stylus'>
bottom_height = 52px;

.name {
    max-width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
}

.wide_btn {
    width: 85%;
    margin: 0 auto;
}
</style>