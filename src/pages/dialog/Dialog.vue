<template>
    <div class='dialog' v-if="friend">
        <div>
            <nut-navbar
                :left-show='true' class='navbar' @on-click-back="$router.back()">
                <template #content>
                    <div class='header'>
                        <img v-lazy="[friend.avatar,'avatar']" class='avatar'>
                        <div class='name'>{{friend.remark?friend.remark:friend.name}}</div>
                    </div>
                </template>
            </nut-navbar>
        </div>
        <DialogMsg :friend="friend" :selfMsg="selfMsg"/>
        <div class='input'>
            <i class="iconfont icon-yuyin1"></i>
            <textarea ref='textDom' @input="changeHeight" @keyup.ctrl.enter ="send($event)" rows='1' v-model="text"></textarea>
            <button class = 'btn' @click='send'  v-show="text">发送</button>
            <i class='iconfont icon-jiahao' v-show="!text" @click='showBottom=true'></i>
        </div>
        <DialogPopup :friend="friend" v-model:showBottom='showBottom'/>
    </div>
    
</template>

<script>
import { computed, onActivated, onMounted } from 'vue';
import { ref, reactive } from 'vue';
import dayjs from 'dayjs';
import { keepBottom } from "@/js/utils";
import { postMsg } from "@/js/ajax";
import store from "@/store";
import DialogMsg from "./DialogMsg.vue";
import DialogPopup from "./DialogPopup.vue";
export default {
  props: ['userId'],
  components: {
    DialogMsg,
    DialogPopup
  },
  name:"Dialog",
  setup(props) {
    let textDom = ref();
    let text = ref('');

    function changeHeight() {
      textDom.value.style.height = 'auto';
      textDom.value.style.height = textDom.value.scrollHeight - 10 + 'px';
    }

    let friend = computed(()=>store.state.friendList.find(item => item.userId === props.userId))
    let selfMsg = computed(() => store.state.selfMsg);
    let showBottom = ref(false);

    function send(e) {
      let userId = friend.value.userId;
      let msg = text.value;

      function setSelfSendMsg() {
        let obj = reactive({
          userId,
          msgWrap: {
            type: 1,
            //发送的
            msg: msg,
            time: dayjs().format('YYYY年MM月DD日 HH:mm'),
            fileType: 'text',
            isSuccess: true
          }
        });
        store.commit('changeDialogMsgs', obj);
        store.state.keepBottom()

        text.value = '';
        textDom.value.style.height = 'auto';

        store.commit('changeMessageList', userId);
        textDom.value.focus()
        return obj;
      }

      if (userId == store.state.selfMsg.userId) {
        setSelfSendMsg();
        return;
      }

      let obj = setSelfSendMsg();
      postMsg(userId, msg).then(data => {
        if (data.code == 0) {
          obj.msgWrap.isSuccess = false;
        }
      }, err => {
        console.log(err, 'ddddddd');
        if (err) obj.msgWrap.isSuccess = false;
      }); 
    } 


    return {
      textDom,
      text,
      changeHeight,
      friend,
      selfMsg,
      send,
      showBottom
    };
  }

};
</script>

<style lang='stylus'>
top_height = 50px
.dialog
    position: absolute
    background: white
    width: 100%
    top:0
    bottom: 0
    z-index:1
    display: flex
    flex-direction: column
    .navbar
        margin-bottom 0
        height 45px
        .header
            display: inline-flex
            align-items: center
            .avatar
                width: 37px
                height 37px
                border-radius: 2rem
                margin-right 10px
                object-fit: cover
            .name
                // line-height: 40px
                font-size: 20px
    .input
        // position: fixed
        // bottom: 0
        display: flex
        align-items: center
        padding 8px  8px
        box-shadow: 0 -1px 7px #edeef1
        transition: all 2s
        flex-shrink: 0
        .iconfont
            font-size: 28px
            align-self: flex-end
        .icon-yuyin1
            margin-right 4px
        .icon-jiahao
            margin-left 4px
        textarea
            border: none;
            border-bottom: 1px solid rgba(0,0,0,0.4);
            padding 5px 5px
            font-size: 15px
            max-height: 100px
            transition: height 2s
            flex-grow 1
            resize: none;
            &:focus
                outline: none
        .btn 
            height: 28px;
            margin-left: 5px;
            background: #d35b1e;
            color: #fff;
            padding: 3px 5px;
            border-radius: 5px;
            align-self: flex-end;
            width: 53px;
            border: none
.muitiple_function   
    height 100%
    display: flex
    align-items: center
    padding 0 20px
    .item 
        display: flex
        flex-direction: column
        align-items: center
        margin-right 20px
        color #333
        .iconfont 
            padding 15px 15px
            border-radius: 10px
            font-size: 30px
            background-color #f5f5f5
        .type
            margin-top 4px
            font-size: 13px
</style>