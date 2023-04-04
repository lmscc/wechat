import axios from "axios";
import { Notify } from '@nutui/nutui';
import { logout } from "@/js/utils"; // axios.defaults.baseURL = '/process.env.API_URL';

console.log(process.env);
// const cookie = document.cookie.match(/session-id=(.+)/) && 
//                 document.cookie.match(/session-id=(.+)/)[1]
console.log(document.cookie)

function errorHandler(err) {
  // 这里是返回状态码不为200时候的错误处理
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '请求错误';
        break;

      case 401:
        logout(1, '请重新登录');
        return;

      case 403:
        err.message = '拒绝访问';
        break;

      case 404:
        err.message = `请求地址出错: ${err.response.config.url}`;
        break;

      case 408:
        err.message = '请求超时';
        break;

      case 500:
        err.message = '服务器内部错误';
        break;

      case 501:
        err.message = '服务未实现';
        break;

      case 502:
        err.message = '网关错误';
        break;

      case 503:
        err.message = '服务不可用';
        break;

      case 504:
        err.message = '网关超时';
        break;

      case 505:
        err.message = 'HTTP版本不受支持';
        break;

      default:
    }
  }

  Notify.danger(err.message);
  console.log('err');
  return Promise.reject(err);
}
axios.interceptors.response.use(req => {
  console.log(req);
  // document.cookie = `session-id=123;path=/`
  return req
})

axios.interceptors.response.use(res => {
  // if(res.headers['content-type'].indexOf("html") >= 0){
  //     logout(1,'请重新登录')
  //     return Promise.reject()
  // }
  return res.data;
}, errorHandler);
const msgBase = '/',
      loginBase = '/login/',
      friendBase = '/friend/',
      slefMsg = '/selfmsg/';
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
export function reqLogin(userId, password, captcha) {
  return axios.post(loginBase + 'psd', {
    userId,
    password,
    captcha
  });
}
export function getLogout() {
  return axios.get(loginBase + 'out');
}
export function reqFriendList() {
  return axios.get(friendBase + 'list');
}
export function postReMark(userId, value) {
  return axios.post(friendBase + 'remark', {
    userId,
    value
  });
}
export function searchFriend(userId) {
  return axios({
    method: 'get',
    url: friendBase + 'search',
    params: {
      userId
    }
  }); // return axios.get(,{
  // })
}
export function addFriend(userId, msg) {
  return axios.post(friendBase + 'add', {
    userId,
    msg
  });
}
export function acceptFriend(userId) {
  return axios.post(friendBase + 'accept', {
    userId
  });
}
export function postMsg(userId, msg) {
  return axios.post(msgBase + 'postMsg', {
    sendto: userId,
    msg,
    type: 'text'
  });
}
export function postFileFirst(userId, obj) {
  return axios.post(msgBase + 'postfilefirst', {
    sendto: userId,
    ...obj
  });
}
export function postMsgFile(userId, form, {
  fileType,
  originName,
  size
}, config) {
  config.headers = {
    "Content-Type": "multipart/form-data",
    "filetype": fileType
  };
  form.append('msg', JSON.stringify({
    sendto: userId,
    type: fileType,
    originName,
    size
  }));
  return axios.post(msgBase + 'postMsg', form, config);
}
export function postImg(data, config) {
  return axios.post(slefMsg + 'avatar', data, config);
}
export function postReName(data) {
  return axios.post(slefMsg + 'rename', data);
}