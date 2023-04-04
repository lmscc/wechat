<template>
    <div class='main_part_2'>
        <nut-navbar
            @on-click-back="$router.back()"
            title="个人信息"
        ></nut-navbar>
        <div class='self_card' @click="file.click()">
            <div class='title'>头像</div>
            <img v-lazy="[selfMsg.avatar,'avatar']"  data-self="true">
            <nut-icon name='arrow-right'></nut-icon>
        </div>
        <div class='self_card' @click="$router.push('/postForm/name/none')">
            <div class='title'>昵称</div>
            <div class='name'>{{selfMsg.name}}</div>
            <nut-icon name='arrow-right'></nut-icon>
        </div>
        <div class='self_card'>
            <div class='title'>微聊号</div>
            <div>{{selfMsg.userId}}</div>
        </div>
        <!-- <nut-uploader url="https://xxxx" ref="file"></nut-uploader> -->
        <input type="file" v-show = 'false' ref="file" @change='upload' accept="image/*">
        <nut-progress v-show='percentage' :percentage="percentage" :show-text="false"/>
        <router-view></router-view>
    </div>
</template>

<script>
import { computed, ref } from 'vue';
import store from "@/store";
import { Notify } from '@nutui/nutui';
import { postImg } from "@/js/ajax";
export default {
  setup() {
    let file = ref();
    let percentage = ref(0);

    function upload() {
      const fileArr = file.value.files;
      console.log(file, fileArr); //若数组为空，结束
      if (fileArr.length === 0) {
        return;
      } //否则
      const url = URL.createObjectURL(fileArr[0])//.match(/blob:(.+)/)[1]
      console.log(url);
      store.commit('updateSelfMsg', {
        key: 'avatar',
        value: url
      });
      

      let data = new FormData();

      for (let i = 0; i < fileArr.length; i++) {
        data.append("file", fileArr[i]);
      }

      console.dir(data); //发送数据

      postImg(data, // 第1个参数 url 第二参数 data数据，第三个是配置渲染，
      // onUploadProgress 当上传进度是
      {
        onUploadProgress: e => {
          console.log(e);
          percentage.value = Math.floor(e.loaded / e.total * 100); // e.loaded 已经上传的字节数据，e.total 字节数据  转换为1-100的比例值 赋值个pre	 
        }
      }).then(data => {
        file.value = ""; // 清空表单数据
        percentage.value = 0; // 清空上传进度数据
      }).finally(err => {
        percentage.value = 0; // console.log(err)
        if(err)Notify.danger('上传失败')
      });
    }

    return {
      file,
      upload,
      percentage,
      selfMsg: computed(() => store.state.selfMsg)
    };
  }

};
</script>

<style lang='stylus'>
top_height = 50px
.self_card
    display: flex
    align-items: center
    padding 15px 17px
    background: white
    border-bottom: 1px solid rgba(0,0,0,0.06)
    .title
        flex-grow: 1
    img 
        width 50px
        height 50px
         
</style>