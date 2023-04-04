<template>
    <div class='main_part_2'>
        <nut-navbar
            title="添加朋友"
            @on-click-back="$router.back()"
        ></nut-navbar>
        <div class='wrap'>
            <input type="text" class='input' v-model="userId">
            <nut-button :type="userId !== ''?'primary':'default'"  @click='search'  class='save_btn' plain block>搜索</nut-button>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { searchFriend } from "@/js/ajax";
import { Notify } from '@nutui/nutui';
import store from "@/store/index";
import router from "@/router/index";
export default {
  name: 'Search',

  setup() {
    let userId = ref('');

    function search() {
      if (userId.value == '') return;
      searchFriend(userId.value).then(data => {
        if (data.code == 0) {
          Notify.warn(data.msg);
        } else {
          let {
            userId
          } = data.msg;

          if (store.state.getFriend(userId) != null) {
            router.replace(`/friendMsg/${userId}`);
          } else {
            store.commit('changeSearch', data.msg);
            router.replace({
              name: 'friendMsg',
              params: {
                userId: 'search'
              }
            });
          }
        }
      });
    }

    return {
      userId,
      search
    };
  }

};
</script>

<style>

</style>