<template>
    <div class="page flex main_part_2">
        <div class="home-type-content flex">
            <h1>WECHAT</h1>
            <div class="home-type-title"></div>
            <div>
                <div class="home-login-list home-login-name">
                    <input
                        type="text"
                        placeholder="用户名/邮箱/手机"
                        autocomplete="on"
                        class=""
                        v-model="msg.count"
                    />
                    <span class="username-icon"></span>
                    <!---->
                </div>
                <div class="home-login-list home-login-password">
                    <input
                        type="password"
                        maxlength="20"
                        placeholder="请输入密码"
                        autocomplete="on"
                        v-model="msg.psd"
                    />
                    <span class="password-icon"></span>
                    <!---->
                </div>
                <div class="home-login-list home-login-captcha">
                    <input
                        type="password"
                        maxlength="20"
                        placeholder="请输入验证码"
                        autocomplete="on"
                        v-model="captcha"
                    />
                    <span class="password-icon"></span>
                    <img class="captcha" ref='captchadom' @click="getCaptcha" />
                    <!---->
                </div>
                <div class="home-login-list auto-login">
                      <a href="/findPwd/?roleType=1" class="forget-password"
                        >忘记密码?</a
                    >
                    <div class="checkbox-pic">
                        <label class=""
                            ><span class=""></span>下次自动登录
                        </label>
                    </div>
                </div>
                <div class="home-login-submit" @click="login"><a>登录</a></div>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, ref } from "vue";
import { onMounted, watchEffect } from "vue";
import { reqLogin, reqFriendList } from "@/js/ajax";
import { Notify } from "@nutui/nutui";
import router from "@/router";
import { useStore } from "vuex";
import { injectPlugin } from "@/store/handleStore";
import eventSourceHandler from "@/js/eventSource";

function handleFriendList(store) {
    watchEffect(() => {
        let dialogMsgs = store.state.dialogMsgs;
        let list = store.state.friendList;
        console.log(dialogMsgs);

        for (let i = 0; i < list.length; i++) {
            if (dialogMsgs[list[i].userId] == null) {
                dialogMsgs[list[i].userId] = {
                    msglist: [],
                    hasNewMsg: false,
                };
            }
        }
    });
}

export default {
    setup() {
        const store = useStore();
        console.log(store);
        let countAndPsd = JSON.parse(localStorage.getItem("countAndPsd"));
        let count, psd;

        if (countAndPsd !== null) {
            count = countAndPsd.count;
            psd = countAndPsd.psd;
        }

        let msg = reactive({
            count: "" || count,
            psd: "" || psd,
        });
        let captcha = ref("");
        let captchadom = ref(null);

        function getCaptcha() {
            // 每次指定的src要不一样
            captchadom.value.src =
                `${process.env.VUE_APP_API_URL}/login/svgCaptcha?time=` +
                Date.now();
        }

        async function login() {
            let selfData = await reqLogin(msg.count, msg.psd, captcha.value);
            
            if (selfData.code == 0) {
                Notify.warn(selfData.msg);
            } else if (selfData.code == 1) {
                if (selfData.msg)
                    Notify.success(selfData.msg, {
                        duration: 500,
                    });
                injectPlugin(selfData.data.userId);
                store.commit("changeSelfMsg", selfData.data); //好友列表
                console.log('data',selfData.data);
              
                reqFriendList().then((data) => {
                    if (data.code == 1) {
                        console.log(data.msg);
                        data.msg.push({
                            avatar: selfData.data.avatar,
                            name: selfData.data.name,
                            userId: selfData.data.userId,
                        });
                        store.commit("changeFriendList", data.msg);
                        handleFriendList(store); // friendList.value = data.msg
                    }
                });
                router.replace("/friendList"); //订阅
                
                let es = new EventSource(
                    `${process.env.VUE_APP_API_URL}/sendMsg`
                );
                es.onmessage = eventSourceHandler;

                localStorage.setItem(
                    "countAndPsd",
                    JSON.stringify({
                        count: msg.count,
                        psd: msg.psd,
                    })
                );
            }
        }

        onMounted(() => {
            getCaptcha(); // login()
        });
        return {
            msg,
            captcha,
            captchadom,
            getCaptcha,
            login,
        };
    },
};
</script>

<style scoped>
.flex {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

a {
    color: rgb(126, 140, 141);
    text-decoration: none;
    backface-visibility: hidden;
}

.home-login .home-type-content {
    position: relative;
    float: right;
    width: 340px;
    height: 400px;
    padding: 35px;
    margin: 85px 40px 0px 0px;
    background: rgb(255, 255, 255);
    border-radius: 8px;
    box-shadow: rgba(102, 103, 117, 0.3) 0px 2px 20px 0px;
}

.home-login .home-type-title {
    margin: 12px 0px 28px;
    font-size: 20px;
    font-weight: 800;
    color: rgb(71, 71, 71);
}

.home-login-list {
    position: relative;
    margin: 15px auto 0px;
}

.home-login-list, .home-login-list > input {
    width: 270px;
    height: 40px;
    box-sizing: border-box;
}

.home-login-list > input {
    font-size: 14px;
    color: rgb(51, 51, 51);
    text-indent: 36px;
    border: 1px solid rgb(218, 218, 218);
    border-radius: 20px;
    outline: none;
}

.home-login-list > span {
    position: absolute;
    top: 11px;
    left: 12px;
    display: block;
}

.home-login-list .username-icon {
    width: 19px;
    height: 19px;
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAkCAMAAADbwBjtAAAAaVBMVEUAAABvb29vb29xcXGFhYVvb29wcHCKiopvb29wcHBzc3NwcHBvb29vb29wcHBwcHBvb29wcHBvb29vb29wcHBxcXFwcHBzc3N3d3dvb29vb29vb29vb29xcXFwcHBxcXFxcXFwcHBvb29fCGgCAAAAInRSTlMAVfiICNdvBMWrK/Pp4NDAuaKTjnRJPhkOyqV+Z2NZNCIg32cXVAAAAOpJREFUOMvNksuygjAQBSEkgfBSRBHf2v//kbdKrwHJZOPK3jBJdZGZU5P8LLk9VNXB5nHjXvCkuMcMbWBl7QqMjigZZP4roitM/uzIUMm/ucHmVW3gJio72L6qLey+VYb5Q4Oo7JnaZS+PVExDF4lMqd7RqTIW75F/jhEhNXhMKgijA+Wu5TiWV6fAjcE4LbjH+/Rw0C6G0i3qPL84K1r9oXSweD2FbhFsJqzG8BFakwdL2swDLOESzniBKcETSoeKVpz8Yc06EBbXDZm8y42vFVZSLMrXNV0q0FF7pSdCP/Xe1wjUvU5+jD+38BobJv2RuAAAAABJRU5ErkJggg==')
    0% 0% / contain no-repeat;
}

.home-login-list .password-icon {
    width: 18px;
    height: 18px;
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAMAAAANmfvwAAAAdVBMVEUAAABwcHCXl5dwcHBxcXFvb29vb29xcXFxcXFxcXFxcXFwcHBvb29vb292dnZwcHBvb29wcHB1dXV0dHSNjY1wcHBwcHBvb29wcHBwcHBxcXFycnJwcHBvb29wcHBwcHBvb29wcHBwcHBzc3Nvb29xcXFvb2+5swZdAAAAJnRSTlMAfQTqYfjVkW9QSvTjvRCzdmobFgfvzZWHXUQk2cfDqaYrqzw3NrNgaGMAAADXSURBVDjLtdLXboMwGEBhjAMUD1YYAbK6zvs/YtWqbazYIckF5+oHfRLGdvRs2/psy0HFN0G7S/hpr26I4gD0p9IAVVDEFo7z9zR2MIZIDcPv2Bi6IkAMafs3TyB88QnOIkt6n2ygdb+a+KRCOk85+IsR12S7Bnl9MxrkpQ5kL1pHJASz7i7oTHhZyP+JZBc6NPd1wksUKCVbjcQite/LpAJ0s0iOAOMiOQFMi2Q2cL7zR4X6WHFfdJjsyRx+aGIvBbVztcPp5nLsA6GkipzmfOM1FdGjfQFCnyAnltsDbgAAAABJRU5ErkJggg==')
    0% 0% / contain no-repeat;
}

.home-login-list.auto-login {
    height: 16px;
    font-size: 12px;
    line-height: 16px;
    color: rgb(110, 114, 121);
    cursor: pointer;
}

.home-login-list .forget-password {
    float: right;
    color: rgb(153, 153, 153);
    text-decoration: none;
    cursor: pointer;
}

.home-login-list .checkbox-pic {
    position: relative;
    width: 14px;
    min-height: 14px;
    user-select: none;
}

.home-login-list .checkbox-pic label {
    position: relative;
    display: block;
    width: 120px;
    height: 16px;
    max-width: 120px;
    font-weight: 400;
    line-height: 16px;
    color: rgb(153, 153, 153);
    text-align: left;
    cursor: pointer;
    user-select: none;
}

.home-login-list .checkbox-pic label span {
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-right: 5px;
    vertical-align: middle;
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAFVBMVEX////Y2Njt7e38/Pz29vbk5OTc3Nx8d6YcAAAAR0lEQVQoz2PABCxhgnCQ6gAUUBREAkJABYLKCNVGgg4MrELI+hUDGNiEkQUMExgYBZD4QN6oAMUCGIGMEQ0YEYUelZiRjQEAfb0L03PTh4wAAAAASUVORK5CYII=') 0% 0% / cover no-repeat;
}

.home-login-submit {
    margin-top: 24px;
    text-align: left;
}

.home-login-submit a {
    display: inline-block;
    width: 270px;
    height: 40px;
    font-size: 16px;
    line-height: 40px;
    color: rgb(255, 255, 255);
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    background-image: linear-gradient(270deg, rgb(255, 90, 0), rgb(255, 37, 0));
    border-radius: 22px;
    outline: none;
    box-shadow: rgba(244, 102, 75, 0.28) 0px 6px 20px 0px;
}

.home-login-register {
    margin: 24px 0px 20px;
    font-size: 14px;
    color: rgb(51, 51, 51);
    text-align: center;
    cursor: pointer;
}

.home-login-register span {
    color: rgb(255, 90, 0);
}

.home-login .home-icon-back {
    width: 30px;
    height: 30px;
    margin: 0px auto;
}

.home-login .home-icon-back img {
    width: 100%;
    height: 100%;
}

.home .home-icon-back {
    cursor: pointer;
}
.home-login-captcha{
  height:auto
}
.captcha{
  width: 100%;
  height: 55px;
  object-fit: none;
}
</style>