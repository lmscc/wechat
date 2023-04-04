<template>
    <div class='main_part_2'>
        <nut-navbar
            title="申请添加好友"
            @on-click-back="$router.back()"
        ></nut-navbar>
        <div class='formWrap'>
            <div class='fromitem'>
                <span class="msg">发送添加好友申请</span>
                <textarea cols="30" rows="3" v-model='msg'></textarea>
            </div>
        </div>
        
         <nut-button  @click='send' :type="msg?'primary':'default'" class='send_btn' plain block>发送</nut-button>
    </div>
</template>

<script>
import { ref } from 'vue';
import { addFriend } from "@/js/ajax";
import { Notify } from '@nutui/nutui';
import router from "@/router";
export default {
  props: ['userId'],

  setup(props) {
    let msg = ref('');

    function send() {
      if (msg.value == '') return;
      addFriend(props.userId, msg.value).then(data => {
        if (data.code == 0) {} else {
          Notify.success('发送请求成功');
          history.go(-2);
        }
      });
    }

    return {
      msg,
      send
    };
  }

};
</script>

<style lang='stylus'>
.formWrap
    display: flex
    flex-direction: column
    align-items: center
    .fromitem
        width: 90%
        margin:9px 5%
        .msg
            font-size: 13px
        textarea
            width: 100%
            margin-top 4px
            border-radius: 4px
            padding 6px
            border: none
            outline: none
            background: #f5f5f5
            caret-color #fa2c19
            font-size: 17px
                
.send_btn
    width: 80%
    margin: 5px auto
    transition: all 0.2s
</style>