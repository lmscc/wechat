<template>
    <transition name="fade">
    <div class='main_part_2'>
        <nut-navbar
            :title="type"
            @on-click-back="$router.back()"
        ></nut-navbar>
        <div class='wrap'>
            <input type="text" class='input' v-model="changedValue">
            <div class='slogan' v-show="type == 'rename'">好名字可以让朋友更容易记住你</div>
            <nut-button :type="ischange?'primary':'default'"  @click='save'  class='save_btn' plain block>保存</nut-button>
        </div>
     
    </div>
    </transition>
</template>

<script>
import { computed, onActivated, onMounted, ref } from 'vue';
import store from "@/store";
import { postReName, postReMark } from "@/js/ajax";
import router from "@/router";
export default {
  name: 'postForm',
  props: ['type', 'userId'],

  setup(props) {
    let originValue, changedValue, ischange, save; // let refresh = function(){

    if (props.type == 'name') {
      originValue = store.state.selfMsg['name'];
    } else {
      let friend = store.state.getFriend(props.userId)
      originValue = friend.remark
    }

    changedValue = ref(originValue);
    ischange = computed(() => changedValue.value != originValue);

    save = function () {
      if (!ischange.value) return;

      if (props.type == 'name') {
        postReName({
          name: changedValue.value
        }).then(data => {
          if (data.code == 1) {
            store.commit('updateSelfMsg', {
              key: 'name',
              value: changedValue.value
            });
            router.back();
          }
        }).catch(err => {
          throw err;
        });
      } else if (props.type == 'remark') {
        postReMark(props.userId, changedValue.value).then(data => {
          if (data.code == 1) {
            let friend = store.state.getFriend(props.userId)
            friend.remark  = changedValue.value;
            router.back();
          }
        });
      }
    }; // }
    // onMounted(refresh)
    // onActivated(refresh)


    return {
      changedValue,
      ischange,
      save
    };
  }

};
</script>

<style lang='stylus'>
btn_width = 85
.wrap
    padding-left 16px
    padding-right 16px
    margin-top 20px
    .input
        width 100%
        height 30px
        border:none
        border-bottom 1px solid #000
        font-size: 18px
        caret-color #fa2c19
        &:focus
            outline: none;
            border-bottom: 2px solid #fa2c19
            background-color: #fff;
    .slogan 
        margin-top 5px
        font-size: 13px
        color #333
    .save_btn
        margin-top 9px
        width btn_width + '%'
        margin-left ((100 - btn_width)/2) + '%'
.side-move-enter-active,
.side-move-leave-active {
  transition: all 0.5s ease;
}
.side-move-enter-from,
.side-move-leave-to 
    transform: translate3d(100%,0,0)
.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>